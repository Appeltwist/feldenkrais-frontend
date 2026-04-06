"use client";

import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet";

import type { EducationPractitionerProfile } from "@/lib/education-practitioners";

type EducationPractitionerDirectoryProps = {
  locale: string;
  title: string;
  lead: string;
  practitioners: EducationPractitionerProfile[];
};

type LeafletModule = typeof import("leaflet");
type PositionedPractitioner = EducationPractitionerProfile & {
  mapLatitude: number | null;
  mapLongitude: number | null;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function getLocationKey(profile: EducationPractitionerProfile) {
  return `${profile.city}|${profile.country}`;
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function buildPopupHtml(profile: EducationPractitionerProfile) {
  const parts = [
    `<strong>${escapeHtml(profile.name)}</strong>`,
    escapeHtml([profile.city, profile.country].filter(Boolean).join(", ")),
    escapeHtml(profile.addressLines.join(", ")),
  ].filter(Boolean);

  return `<div class="education-practitioner-popup">${parts.join("<br />")}</div>`;
}

function getPositionedPractitioners(practitioners: EducationPractitionerProfile[]): PositionedPractitioner[] {
  const grouped = new Map<string, EducationPractitionerProfile[]>();

  for (const practitioner of practitioners) {
    const key = getLocationKey(practitioner);
    const group = grouped.get(key) ?? [];
    group.push(practitioner);
    grouped.set(key, group);
  }

  return practitioners.map((practitioner) => {
    const locationGroup = grouped.get(getLocationKey(practitioner)) ?? [practitioner];
    const positionIndex = locationGroup.findIndex(({ id }) => id === practitioner.id);

    if (locationGroup.length <= 1 || practitioner.latitude == null || practitioner.longitude == null) {
      return {
        ...practitioner,
        mapLatitude: practitioner.latitude,
        mapLongitude: practitioner.longitude,
      };
    }

    const angle = (Math.PI * 2 * positionIndex) / locationGroup.length;
    const offset = 0.015;

    return {
      ...practitioner,
      mapLatitude: practitioner.latitude + Math.sin(angle) * offset,
      mapLongitude: practitioner.longitude + Math.cos(angle) * offset,
    };
  });
}

export default function EducationPractitionerDirectory({
  locale,
  title,
  lead,
  practitioners,
}: EducationPractitionerDirectoryProps) {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [activePractitionerId, setActivePractitionerId] = useState<string | null>(practitioners[0]?.id ?? null);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const markerRefs = useRef<Map<string, Marker>>(new Map());

  const locationCounts = new Map<string, { city: string; country: string; count: number }>();
  for (const practitioner of practitioners) {
    const key = getLocationKey(practitioner);
    const current = locationCounts.get(key);
    if (current) {
      current.count += 1;
    } else {
      locationCounts.set(key, {
        city: practitioner.city,
        country: practitioner.country,
        count: 1,
      });
    }
  }

  const locationOptions = Array.from(locationCounts.entries())
    .map(([value, data]) => ({
      value,
      city: data.city,
      country: data.country,
      count: data.count,
      label: `${data.city}, ${data.country}`,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));

  const filteredPractitioners =
    selectedLocation === "all"
      ? practitioners
      : practitioners.filter((practitioner) => getLocationKey(practitioner) === selectedLocation);

  const sortedPractitioners = [...filteredPractitioners].sort((left, right) => {
    const leftLabel = `${left.country} ${left.city} ${left.name}`;
    const rightLabel = `${right.country} ${right.city} ${right.name}`;
    return leftLabel.localeCompare(rightLabel);
  });
  const hasActivePractitioner = sortedPractitioners.some(({ id }) => id === activePractitionerId);
  const firstPractitionerId = sortedPractitioners[0]?.id ?? null;

  useEffect(() => {
    if (hasActivePractitioner) {
      return;
    }

    setActivePractitionerId(firstPractitionerId);
  }, [firstPractitionerId, hasActivePractitioner]);

  useEffect(() => {
    let cancelled = false;
    const markers = markerRefs.current;

    async function initializeMap() {
      if (mapRef.current || !mapContainerRef.current) {
        return;
      }

      const Leaflet = await import("leaflet");
      if (cancelled || !mapContainerRef.current) {
        return;
      }

      leafletRef.current = Leaflet;

      const map = Leaflet.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      });

      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      layerRef.current = Leaflet.layerGroup().addTo(map);
      mapRef.current = map;
      setIsMapReady(true);

      // Leaflet sometimes needs a follow-up size check after hydration/layout settles.
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
      setTimeout(() => {
        map.invalidateSize();
      }, 180);
    }

    initializeMap();

    return () => {
      cancelled = true;
      markers.clear();

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      setIsMapReady(false);
      layerRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    const Leaflet = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;

    if (!Leaflet || !map || !layer) {
      return;
    }

    const nextPractitioners = [...(selectedLocation === "all"
      ? practitioners
      : practitioners.filter((practitioner) => getLocationKey(practitioner) === selectedLocation))].sort(
      (left, right) => {
        const leftLabel = `${left.country} ${left.city} ${left.name}`;
        const rightLabel = `${right.country} ${right.city} ${right.name}`;
        return leftLabel.localeCompare(rightLabel);
      },
    );

    const visiblePractitioners = getPositionedPractitioners(
      nextPractitioners.filter(
        (practitioner) => practitioner.latitude != null && practitioner.longitude != null,
      ),
    );

    layer.clearLayers();
    markerRefs.current.clear();

    if (visiblePractitioners.length === 0) {
      return;
    }

    const bounds: [number, number][] = [];

    for (const practitioner of visiblePractitioners) {
      if (practitioner.mapLatitude == null || practitioner.mapLongitude == null) {
        continue;
      }

      const marker = Leaflet.marker([practitioner.mapLatitude, practitioner.mapLongitude], {
        icon: Leaflet.divIcon({
          className: "education-practitioner-map-marker",
          html: "<span></span>",
          iconAnchor: [10, 10],
          iconSize: [20, 20],
          popupAnchor: [0, -16],
        }),
      });

      marker.bindPopup(buildPopupHtml(practitioner));
      marker.on("click", () => {
        setActivePractitionerId(practitioner.id);
      });

      layer.addLayer(marker);
      markerRefs.current.set(practitioner.id, marker);
      bounds.push([practitioner.mapLatitude, practitioner.mapLongitude]);
    }

    if (bounds.length === 1) {
      map.setView(bounds[0], 7);
      return;
    }

    map.fitBounds(bounds, { padding: [48, 48] });
  }, [isMapReady, practitioners, selectedLocation]);

  useEffect(() => {
    if (!isMapReady || !activePractitionerId || !mapRef.current) {
      return;
    }

    const marker = markerRefs.current.get(activePractitionerId);
    if (!marker) {
      return;
    }

    const map = mapRef.current;
    const nextZoom = Math.max(map.getZoom(), 6);

    map.flyTo(marker.getLatLng(), nextZoom, {
      duration: 0.35,
    });
    marker.openPopup();
  }, [activePractitionerId, isMapReady]);

  return (
    <div className="education-practitioner-directory">
      <section className="education-practitioner-directory__map-section">
        <div className="education-practitioner-directory__heading">
          <h1>{title}</h1>
          <p>{lead}</p>
        </div>

        <div className="education-practitioner-directory__map-card">
          <div className="education-practitioner-directory__map" ref={mapContainerRef} />
        </div>
      </section>

      <section className="education-practitioner-directory__list-section">
        <div className="education-practitioner-directory__toolbar">
          <div className="education-practitioner-directory__toolbar-copy">
            <h2>{t(locale, "Annuaire", "Directory")}</h2>
            <p>
              {t(
                locale,
                "Filtrez les praticien·nes par lieu puis cliquez sur une fiche pour la retrouver sur la carte.",
                "Filter practitioners by location, then click a profile to focus it on the map.",
              )}
            </p>
          </div>

          <label className="education-practitioner-directory__filter">
            <span>{t(locale, "Filtrer par lieu", "Filter by location")}</span>
            <select
              onChange={(event) => {
                setSelectedLocation(event.target.value);
              }}
              value={selectedLocation}
            >
              <option value="all">{t(locale, "Tous les lieux", "All locations")}</option>
              {locationOptions.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label} ({location.count})
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="education-practitioner-directory__count">
          {t(locale, "Praticien·nes affiché·es", "Practitioners shown")}: {sortedPractitioners.length}
        </p>

        <div className="education-practitioner-directory__grid">
          {sortedPractitioners.map((practitioner) => (
            <article
              className={`education-practitioner-card${activePractitionerId === practitioner.id ? " is-active" : ""}`}
              key={practitioner.id}
            >
              <div className="education-practitioner-card__header">
                <span className="education-practitioner-card__location">
                  {practitioner.city}, {practitioner.country}
                </span>
                {practitioner.graduationYear ? (
                  <span className="education-practitioner-card__year">{practitioner.graduationYear}</span>
                ) : null}
              </div>

              <h3>{practitioner.name}</h3>

              <p className="education-practitioner-card__address">
                {practitioner.addressLines.map((line) => (
                  <span key={`${practitioner.id}-${line}`}>{line}</span>
                ))}
              </p>

              {practitioner.trainingProgram ? (
                <p className="education-practitioner-card__meta">
                  {t(locale, "Formation", "Training")}: {practitioner.trainingProgram}
                </p>
              ) : null}

              <div className="education-practitioner-card__actions">
                <button
                  className="education-button education-button--secondary"
                  onClick={() => {
                    setActivePractitionerId(practitioner.id);
                  }}
                  type="button"
                >
                  {t(locale, "Voir sur la carte", "Show on map")}
                </button>

                {practitioner.email ? (
                  <a className="education-practitioner-card__link" href={`mailto:${practitioner.email}`}>
                    {t(locale, "E-mail", "Email")}
                  </a>
                ) : null}

                {practitioner.website ? (
                  <a
                    className="education-practitioner-card__link"
                    href={practitioner.website}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {t(locale, "Site web", "Website")}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
