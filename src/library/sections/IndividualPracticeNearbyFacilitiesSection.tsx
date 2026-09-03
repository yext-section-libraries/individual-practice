import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { parsePhoneNumber } from "awesome-phonenumber";
import type { PuckComponent } from "@puckeditor/core";
import {
  Address,
  AnalyticsScopeProvider,
  Link,
  type AddressType,
} from "@yext/pages-components";
import {
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultForegroundColor,
  getThemeColorCssValue,
  MapboxStaticMapComponent,
  mapboxStaticMapStyleOptions,
  mergeMeta,
  resolveComponentData,
  resolveUrlTemplate,
  type StyledButtonValue,
  type StyledLinkValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

type CoordinateValue = {
  latitude: number;
  longitude: number;
};

type NearbyLocationDocument = {
  id?: string;
  name?: string;
  address?: AddressType;
  distanceFromFilter?: number;
  geocodedCoordinate?: CoordinateValue;
  mainPhone?: string;
  yextDisplayCoordinate?: CoordinateValue;
};

type NearbyMapProps = {
  coordinate: YextEntityField<CoordinateValue>;
  mapStyle: string;
  zoom: number;
};

type NearbyPhoneProps = {
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

type NearbyAddressProps = {
  showRegion: boolean;
  showCountry: boolean;
};

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type NearbyCtaStyles = {
  variant: "primary" | "secondary" | "link";
  color?: ThemeColor;
  button?: StyledButtonValue;
  link?: StyledLinkValue;
};

type NearbyConfiguredCtaProps = {
  label: TranslatableString;
  styles: NearbyCtaStyles;
};

type IndividualPracticeNearbyFacilitiesSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  map: NearbyMapProps;
  radius: number;
  limit: number;
  cardBackgroundColor: ThemeColor;
  cardTitleColor?: ThemeColor;
  showPhone: boolean;
  showAddress: boolean;
  phone: NearbyPhoneProps;
  address: NearbyAddressProps;
  addressPanelBackgroundColor: ThemeColor;
  primaryCta: NearbyConfiguredCtaProps;
  secondaryCta: NearbyConfiguredCtaProps;
};

const whiteBackground: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const titleColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const lightPanelBackground: ThemeColor = {
  selectedColor: "palette-quaternary-light",
  contrastingColor: "black",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const EARTH_RADIUS_MI = 3958.7613;

const getNearbyLocationDistance = (
  locationData: NearbyLocationDocument,
  origin: CoordinateValue | undefined,
): number | undefined => {
  if (Number.isFinite(locationData.distanceFromFilter)) {
    return locationData.distanceFromFilter;
  }

  if (
    !Number.isFinite(origin?.latitude) ||
    !Number.isFinite(origin?.longitude)
  ) {
    return undefined;
  }
  const originCoordinate: CoordinateValue = {
    latitude: origin!.latitude,
    longitude: origin!.longitude,
  };

  const locationCoordinate =
    Number.isFinite(locationData.yextDisplayCoordinate?.latitude) &&
    Number.isFinite(locationData.yextDisplayCoordinate?.longitude)
      ? locationData.yextDisplayCoordinate
      : Number.isFinite(locationData.geocodedCoordinate?.latitude) &&
          Number.isFinite(locationData.geocodedCoordinate?.longitude)
        ? locationData.geocodedCoordinate
        : undefined;

  if (!locationCoordinate) {
    return undefined;
  }

  const toRadians = (value: number): number => (value * Math.PI) / 180;
  const latitudeDelta = toRadians(
    locationCoordinate.latitude - originCoordinate.latitude,
  );
  const longitudeDelta = toRadians(
    locationCoordinate.longitude - originCoordinate.longitude,
  );
  const originLatitude = toRadians(originCoordinate.latitude);
  const locationLatitude = toRadians(locationCoordinate.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(locationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    2 *
    EARTH_RADIUS_MI *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
};

const createNearbyCtaStyles = (): NearbyCtaStyles => ({
  variant: "secondary",
  button: {
    fontFamily: "default",
    fontSize: "default",
    fontWeight: "default",
    fontStyle: "default",
    textTransform: "default",
    letterSpacing: "default",
    borderRadius: "9999px",
  },
  link: {
    fontFamily: "default",
    fontSize: "default",
    fontWeight: "default",
    fontStyle: "default",
    textTransform: "default",
    letterSpacing: "default",
    includeCaret: "default",
  },
});

const createNearbyConfiguredCta = (label: string): NearbyConfiguredCtaProps => ({
  label: { defaultValue: label },
  styles: createNearbyCtaStyles(),
});

const createRenderedCta = (
  cta: NearbyConfiguredCtaProps,
  link: string,
): Partial<ComprehensiveCTAValue> => {
  return {
    data: {
      actionType: "link",
      cta: {
        field: "",
        constantValueEnabled: true,
        constantValue: {
          ctaType: "textAndLink",
          label: cta.label,
          link: {
            defaultValue: link,
          },
          linkType: "URL",
        },
        selectedType: "textAndLink",
      },
      openInNewTab: false,
      buttonText: cta.label,
      customId: "",
      customClass: "",
      dataAttributes: [],
      ariaLabel: cta.label,
    },
    styles: cta.styles,
  } as Partial<ComprehensiveCTAValue>;
};

const formatPhone = (
  phoneNumber: string,
  format: "international" | "domestic",
): string => {
  const parsed = parsePhoneNumber(phoneNumber.replace(/[^\d+]/g, ""));
  if (!parsed.valid || parsed.number === undefined) {
    return phoneNumber;
  }

  return format === "international"
    ? parsed.number.international
    : parsed.number.national;
};

const IndividualPracticeNearbyFacilitiesSectionFields: YextFields<IndividualPracticeNearbyFacilitiesSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    heading: {
      label: "Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    map: {
      label: "Map",
      type: "object",
      objectFields: {
        coordinate: {
          type: "entityField",
          label: "Coordinates",
          filter: { types: ["type.coordinate"] },
        },
        mapStyle: {
          label: "Mapbox Map Style",
          type: "select",
          options: mapboxStaticMapStyleOptions,
        },
        zoom: {
          label: "Zoom",
          type: "number",
          min: 0,
          max: 22,
        },
      },
    },
    radius: {
      label: "Radius",
      type: "number",
      min: 1,
      max: 50,
    },
    limit: {
      label: "Limit",
      type: "number",
      min: 1,
      max: 10,
    },
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    cardTitleColor: {
      label: "Card Title Color",
      type: "basicSelector",
      options: "SITE_COLOR",
    },
    showPhone: {
      label: "Show Phone",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showAddress: {
      label: "Show Address",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    phone: {
      label: "Phone",
      type: "object",
      objectFields: {
        phoneFormat: {
          label: "Phone Number Format",
          type: "radio",
          options: [
            { label: "Domestic", value: "domestic" },
            { label: "International", value: "international" },
          ],
        },
        includeHyperlink: {
          label: "Include Phone Hyperlink",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    address: {
      label: "Address",
      type: "object",
      objectFields: {
        showRegion: {
          label: "Show Region",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        showCountry: {
          label: "Show Country",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    addressPanelBackgroundColor: {
      label: "Address Panel Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    primaryCta: {
      label: "Primary CTA",
      type: "object",
      objectFields: {
        label: {
          label: "Label",
          type: "translatableString",
        },
        styles: {
          label: "Styles",
          type: "object",
          objectFields: {
            variant: {
              label: "Variant",
              type: "radio",
              options: [
                { label: "Solid", value: "primary" },
                { label: "Outline", value: "secondary" },
                { label: "Link", value: "link" },
              ],
            },
            color: {
              label: "Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            button: {
              label: "Button Styles",
              type: "styledButton",
            },
            link: {
              label: "Link Styles",
              type: "styledLink",
              showIncludeCaretField: true,
            },
          },
        },
      },
    },
    secondaryCta: {
      label: "Secondary CTA",
      type: "object",
      objectFields: {
        label: {
          label: "Label",
          type: "translatableString",
        },
        styles: {
          label: "Styles",
          type: "object",
          objectFields: {
            variant: {
              label: "Variant",
              type: "radio",
              options: [
                { label: "Solid", value: "primary" },
                { label: "Outline", value: "secondary" },
                { label: "Link", value: "link" },
              ],
            },
            color: {
              label: "Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            button: {
              label: "Button Styles",
              type: "styledButton",
            },
            link: {
              label: "Link Styles",
              type: "styledLink",
              showIncludeCaretField: true,
            },
          },
        },
      },
    },
  };

const IndividualPracticeNearbyFacilitiesSectionComponent: PuckComponent<IndividualPracticeNearbyFacilitiesSectionProps> =
  (props) => {
    const streamDocument = useDocument<Record<string, unknown>>();
    const locale = streamDocument.locale?.toString() ?? "en";
    const { relativePrefixToRoot } = useTemplateProps<{
      relativePrefixToRoot?: string;
    }>();
    const configuredCoordinate = resolveComponentData(
      props.map.coordinate,
      locale,
      streamDocument,
    ) as CoordinateValue | undefined;
    const documentCoordinate = streamDocument.yextDisplayCoordinate as
      | CoordinateValue
      | undefined;
    const coordinate = documentCoordinate ?? configuredCoordinate;
    const enabled =
      coordinate?.latitude !== undefined &&
      coordinate?.longitude !== undefined &&
      Boolean(props.radius) &&
      Boolean(props.limit);

    const { data, status } = useNearbyLocations({
      streamDocument,
      latitude: coordinate?.latitude,
      longitude: coordinate?.longitude,
      radiusMi: props.radius,
      limit: props.limit,
      enabled,
    });

    const docs = (data?.response?.docs ?? []) as NearbyLocationDocument[];
    const heading =
      resolveComponentData(props.heading.text, locale, streamDocument)?.toString() ??
      "";
    const cardForeground = getThemeColorCssValue(
      props.cardBackgroundColor.contrastingColor,
    );
    const cardCtaForegroundColor = getDefaultForegroundColor(
      props.cardBackgroundColor,
      streamDocument,
    );
    const cardTitleColor =
      !props.cardTitleColor ||
      props.cardTitleColor.selectedColor === "default"
        ? cardForeground
        : getThemeColorCssValue(props.cardTitleColor);
    const addressPanelForeground = getThemeColorCssValue(
      props.addressPanelBackgroundColor.contrastingColor,
    );

    if (!enabled && !props.puck.isEditing) {
      return <></>;
    }

    if ((status !== "success" || !docs.length) && !props.puck.isEditing) {
      return <></>;
    }

    return (
      <VisibilityWrapper
        isEditing={props.puck.isEditing}
        liveVisibility={props.section.visibleOnLivePage}
      >
        <style>{`
          .yip-nearby-root p {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-nearby-root li {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-nearby-root h1 {
            font-family: var(--fontFamily-h1-fontFamily);
            font-size: var(--fontSize-h1-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h1-fontWeight);
            font-style: var(--fontStyle-h1-fontStyle);
            text-transform: var(--textTransform-h1-textTransform);
          }

          .yip-nearby-root h2 {
            font-family: var(--fontFamily-h2-fontFamily);
            font-size: var(--fontSize-h2-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h2-fontWeight);
            font-style: var(--fontStyle-h2-fontStyle);
            text-transform: var(--textTransform-h2-textTransform);
          }

          .yip-nearby-root h3 {
            font-family: var(--fontFamily-h3-fontFamily);
            font-size: var(--fontSize-h3-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h3-fontWeight);
            font-style: var(--fontStyle-h3-fontStyle);
            text-transform: var(--textTransform-h3-textTransform);
          }

          .yip-nearby-root h4 {
            font-family: var(--fontFamily-h4-fontFamily);
            font-size: var(--fontSize-h4-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h4-fontWeight);
            font-style: var(--fontStyle-h4-fontStyle);
            text-transform: var(--textTransform-h4-textTransform);
          }

          .yip-nearby-root h5 {
            font-family: var(--fontFamily-h5-fontFamily);
            font-size: var(--fontSize-h5-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h5-fontWeight);
            font-style: var(--fontStyle-h5-fontStyle);
            text-transform: var(--textTransform-h5-textTransform);
          }

          .yip-nearby-root h6 {
            font-family: var(--fontFamily-h6-fontFamily);
            font-size: var(--fontSize-h6-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h6-fontWeight);
            font-style: var(--fontStyle-h6-fontStyle);
            text-transform: var(--textTransform-h6-textTransform);
          }

          .yip-nearby-root a.yip-nearby-text-link,
          .yip-nearby-root .yip-nearby-rich-text a {
            color: inherit;
            font-family: var(--fontFamily-link-fontFamily);
            font-size: var(--fontSize-link-fontSize);
            font-weight: var(--fontWeight-link-fontWeight);
            font-style: var(--fontStyle-link-fontStyle);
            line-height: 1.5;
            text-decoration: underline;
            text-transform: var(--textTransform-link-textTransform);
            letter-spacing: var(--letterSpacing-link-letterSpacing);
          }

          .yip-nearby-action--button,
          .yip-nearby-action--button > * {
            width: 100%;
          }

          .yip-nearby-action--button a,
          .yip-nearby-action--button button {
            box-sizing: border-box;
            display: inline-flex;
            justify-content: center;
            width: 100%;
          }

          @media (max-width: 64rem) {
            .yip-nearby-layout {
              gap: 2rem !important;
              grid-template-columns: 1fr !important;
            }

            .yip-nearby-map {
              min-height: 30rem !important;
            }
          }

          @media (max-width: 48rem) {
            .yip-nearby-actions {
              grid-template-columns: 1fr !important;
            }

            .yip-nearby-map {
              min-height: 24rem !important;
            }
          }
        `}</style>
        <section
          className="yip-nearby-root px-4 py-pageSection-verticalPadding"
          style={{
            backgroundColor: getThemeColorCssValue(props.section.backgroundColor),
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: "min(100%, 73rem)",
            }}
          >
            <div
              className="yip-nearby-layout"
              style={{
                alignItems: "stretch",
                display: "grid",
                gap: "4rem",
                gridTemplateColumns: "minmax(0, 46.9375rem) minmax(20rem, 30.25rem)",
              }}
            >
              <div
                className="yip-nearby-map"
                style={{
                  background: "#d9d9d9",
                  borderRadius: "16px",
                  minHeight: "30rem",
                  overflow: "hidden",
                }}
              >
                {coordinate ? (
                  <EntityField
                    displayName="Map Coordinate"
                    fieldId={props.map.coordinate.field}
                    constantValueEnabled={
                      props.map.coordinate.constantValueEnabled
                    }
                  >
                    <MapboxStaticMapComponent
                      coordinate={props.map.coordinate}
                      id={props.id}
                      mapStyle={props.map.mapStyle}
                      zoom={props.map.zoom}
                      height="100%"
                      puck={props.puck}
                    />
                  </EntityField>
                ) : null}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={props.heading.text.constantValueEnabled}
                  >
                    <h2
                      style={{
                        color: getThemeColorCssValue(
                          props.heading.fontColor ??
                            props.section.backgroundColor.contrastingColor,
                        ),
                        fontFamily:
                          props.heading.styles.fontFamily === "default"
                            ? undefined
                            : props.heading.styles.fontFamily,
                        fontSize:
                          props.heading.styles.fontSize === "default"
                            ? "clamp(2rem, 5vw, 3rem)"
                            : props.heading.styles.fontSize,
                        fontStyle:
                          props.heading.styles.fontStyle === "default"
                            ? undefined
                            : props.heading.styles.fontStyle,
                        fontWeight:
                          props.heading.styles.fontWeight === "default"
                            ? 500
                            : props.heading.styles.fontWeight,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.25,
                        margin: 0,
                        textTransform:
                          props.heading.styles.textTransform === "default"
                            ? undefined
                            : props.heading.styles.textTransform,
                      }}
                    >
                      {heading}
                    </h2>
                  </EntityField>
                </div>
                {status === "pending" ? (
                  <p>Loading nearby locations</p>
                ) : docs.length ? (
                  <div
                    style={{
                      display: "grid",
                      gap: "16px",
                    }}
                  >
                    {docs.map((locationData, index) => {
                      const resolvedUrl = resolveUrlTemplate(
                        mergeMeta(locationData, streamDocument),
                        relativePrefixToRoot ?? "",
                      );
                      const address =
                        props.showAddress && locationData.address
                          ? locationData.address
                          : undefined;
                      const distanceFromFilter = getNearbyLocationDistance(
                        locationData,
                        coordinate,
                      );
                      const phone = locationData.mainPhone?.trim() ?? "";
                      const showPhone = props.showPhone && Boolean(phone);
                      const directionsUrl =
                        locationData.yextDisplayCoordinate?.latitude !==
                          undefined &&
                        locationData.yextDisplayCoordinate?.longitude !==
                          undefined
                          ? `https://www.google.com/maps/search/?api=1&query=${locationData.yextDisplayCoordinate.latitude},${locationData.yextDisplayCoordinate.longitude}`
                          : undefined;
                      const renderedPrimaryCta = createRenderedCta(
                        props.primaryCta,
                        resolvedUrl,
                      );
                      const primaryCtaVariant = props.primaryCta.styles.variant;
                      const primaryCtaColor = props.primaryCta.styles.color;
                      const renderedPrimaryCtaWithContrast =
                        primaryCtaVariant === "secondary" &&
                        (!primaryCtaColor ||
                          primaryCtaColor.selectedColor === "default") &&
                        cardCtaForegroundColor
                          ? {
                              ...renderedPrimaryCta,
                              styles: {
                                ...renderedPrimaryCta.styles,
                                color: cardCtaForegroundColor,
                              },
                            }
                          : renderedPrimaryCta;
                      const renderedSecondaryCta = directionsUrl
                        ? createRenderedCta(props.secondaryCta, directionsUrl)
                        : undefined;
                      const secondaryCtaVariant = props.secondaryCta.styles.variant;
                      const secondaryCtaColor = props.secondaryCta.styles.color;
                      const renderedSecondaryCtaWithContrast =
                        renderedSecondaryCta &&
                        secondaryCtaVariant === "secondary" &&
                        (!secondaryCtaColor ||
                          secondaryCtaColor.selectedColor === "default") &&
                        cardCtaForegroundColor
                          ? {
                              ...renderedSecondaryCta,
                              styles: {
                                ...renderedSecondaryCta.styles,
                                color: cardCtaForegroundColor,
                              },
                            }
                          : renderedSecondaryCta;

                      return (
                        <article
                          key={locationData.id ?? locationData.name ?? index}
                          style={{
                            backgroundColor: getThemeColorCssValue(
                              props.cardBackgroundColor,
                            ),
                            border: `1px solid color-mix(in srgb, ${cardForeground} 8%, transparent)`,
                            borderRadius: "8px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                            padding: "16px",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <h3
                              style={{
                                color: cardTitleColor,
                                fontSize: "1.2rem",
                                lineHeight: 1.25,
                                margin: 0,
                              }}
                            >
                              {locationData.name ?? "Nearby Facility"}
                            </h3>
                            {distanceFromFilter !== undefined ? (
                              <p
                                style={{
                                  color: `color-mix(in srgb, ${cardForeground} 68%, transparent)`,
                                  fontSize: "0.95rem",
                                  letterSpacing: "-0.02em",
                                  lineHeight: 1.5,
                                  margin: "6px 0 0",
                                }}
                              >
                                {distanceFromFilter.toFixed(1)} miles away
                              </p>
                            ) : null}
                          </div>
                          {address || showPhone ? (
                            <div
                              style={{
                                backgroundColor: getThemeColorCssValue(
                                  props.addressPanelBackgroundColor,
                                ),
                                color: addressPanelForeground,
                                padding: "12px",
                              }}
                            >
                              {address ? (
                                <Address
                                  address={address}
                                  showRegion={props.address.showRegion}
                                  showCountry={props.address.showCountry}
                                />
                              ) : null}
                              {showPhone ? (
                                <p
                                  style={{
                                    margin: address ? "12px 0 0" : 0,
                                  }}
                                >
                                  {props.phone.includeHyperlink ? (
                                    <Link
                                      cta={{
                                        link: phone,
                                        linkType: "PHONE",
                                      }}
                                      eventName={`phone${index}`}
                                      className="yip-nearby-text-link"
                                    >
                                      {formatPhone(phone, props.phone.phoneFormat)}
                                    </Link>
                                  ) : (
                                    formatPhone(phone, props.phone.phoneFormat)
                                  )}
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                          <div
                            className="yip-nearby-actions"
                            style={{
                              display: "grid",
                              gap: "10px",
                            }}
                          >
                            <div
                              className={
                                props.primaryCta.styles.variant === "link"
                                  ? undefined
                                  : "yip-nearby-action--button"
                              }
                            >
                              <ComprehensiveCTA
                                value={
                                  renderedPrimaryCtaWithContrast as Partial<ComprehensiveCTAValue>
                                }
                                eventName={`nearbyPrimaryCta-${index}`}
                              />
                            </div>
                            {renderedSecondaryCtaWithContrast ? (
                              <div
                                className={
                                  props.secondaryCta.styles.variant === "link"
                                    ? undefined
                                    : "yip-nearby-action--button"
                                }
                              >
                                <ComprehensiveCTA
                                  value={
                                    renderedSecondaryCtaWithContrast as Partial<ComprehensiveCTAValue>
                                  }
                                  eventName={`nearbySecondaryCta-${index}`}
                                />
                              </div>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p>No nearby locations found for this location</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </VisibilityWrapper>
    );
  };

export const IndividualPracticeNearbyFacilitiesSection: YextComponentConfig<IndividualPracticeNearbyFacilitiesSectionProps> =
  {
    label: "Nearby Facilities Section",
    fields: IndividualPracticeNearbyFacilitiesSectionFields,
    resolveFields: (data, { fields }) => {
      const primaryCtaField = fields.primaryCta as typeof fields.primaryCta & {
        objectFields: {
          label: unknown;
          styles: {
            objectFields: {
              button: { visible?: boolean };
              link: { visible?: boolean };
            };
          };
        };
      };
      const secondaryCtaField = fields.secondaryCta as typeof fields.secondaryCta & {
        objectFields: {
          label: unknown;
          styles: {
            objectFields: {
              button: { visible?: boolean };
              link: { visible?: boolean };
            };
          };
        };
      };
      const primaryVariant = data.props.primaryCta?.styles?.variant ?? "secondary";
      const showPrimaryButtonStyles =
        primaryVariant === "primary" || primaryVariant === "secondary";
      const showPrimaryLinkStyles = primaryVariant === "link";
      const secondaryVariant =
        data.props.secondaryCta?.styles?.variant ?? "secondary";
      const showSecondaryButtonStyles =
        secondaryVariant === "primary" || secondaryVariant === "secondary";
      const showSecondaryLinkStyles = secondaryVariant === "link";

      return {
        ...fields,
        primaryCta: {
          ...primaryCtaField,
          objectFields: {
            ...primaryCtaField.objectFields,
            label: primaryCtaField.objectFields.label,
            styles: {
              ...primaryCtaField.objectFields.styles,
              objectFields: {
                ...primaryCtaField.objectFields.styles.objectFields,
                button: {
                  ...primaryCtaField.objectFields.styles.objectFields.button,
                  visible: showPrimaryButtonStyles,
                },
                link: {
                  ...primaryCtaField.objectFields.styles.objectFields.link,
                  visible: showPrimaryLinkStyles,
                },
              },
            },
          },
        } as typeof fields.primaryCta,
        secondaryCta: {
          ...secondaryCtaField,
          objectFields: {
            ...secondaryCtaField.objectFields,
            label: secondaryCtaField.objectFields.label,
            styles: {
              ...secondaryCtaField.objectFields.styles,
              objectFields: {
                ...secondaryCtaField.objectFields.styles.objectFields,
                button: {
                  ...secondaryCtaField.objectFields.styles.objectFields.button,
                  visible: showSecondaryButtonStyles,
                },
                link: {
                  ...secondaryCtaField.objectFields.styles.objectFields.link,
                  visible: showSecondaryLinkStyles,
                },
              },
            },
          },
        } as typeof fields.secondaryCta,
      };
    },
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Nearby Facilities",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: titleColor,
      },
      map: {
        coordinate: {
          field: "yextDisplayCoordinate",
          constantValue: {
            latitude: 0,
            longitude: 0,
          },
          constantValueEnabled: false,
        },
        mapStyle: "streets-v12",
        zoom: 12,
      },
      radius: 10,
      limit: 3,
      cardBackgroundColor: whiteBackground,
      showPhone: true,
      showAddress: true,
      phone: {
        phoneFormat: "domestic",
        includeHyperlink: true,
      },
      address: {
        showRegion: true,
        showCountry: false,
      },
      addressPanelBackgroundColor: lightPanelBackground,
      primaryCta: createNearbyConfiguredCta("More Details"),
      secondaryCta: createNearbyConfiguredCta("Get Directions"),
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeNearbyFacilitiesSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeNearbyFacilitiesSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeNearbyFacilitiesSection",
  displayName: "Nearby Facilities Section",
  description: "Nearby Facilities Section",
  pageSetTypes: ["ENTITY"],
};
