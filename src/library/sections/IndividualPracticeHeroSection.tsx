import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import {
  AnalyticsScopeProvider,
  HoursStatus,
  type ComplexImageType,
  type HoursType,
  type ImageType,
  type StatusParams,
} from "@yext/pages-components";
import {
  msg,
  Background,
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  getDefaultForegroundColor,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  Image,
  resolveComponentData,
  type StyledTextValue,
  type StyledImageValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  aspectRatioOptions,
  defaultTextStyles,
  primaryColor,
  renderRichText,
  sectionField,
  whiteBackground,
} from "../shared/sectionHelpers";

type HeroImage = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  fontColor?: ThemeColor;
};

type HoursStatusStyles = {
  showCurrentStatus: boolean;
  timeFormat: "12h" | "24h";
  dayOfWeekFormat: "short" | "long";
  showDayNames: boolean;
};

type IndividualPracticeHeroSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  cardBackgroundColor: ThemeColor;
  hoursStatusBackgroundColor: ThemeColor;
  hours: YextEntityField<HoursType>;
  hoursStyles: HoursStatusStyles;
  heading: StyledTextProps;
  subheading: StyledTextProps;
  body: StyledRtfProps;
  heroImage: HeroImage;
  primaryCta: Partial<ComprehensiveCTAValue>;
  secondaryCta: Partial<ComprehensiveCTAValue>;
  tertiaryCta: Partial<ComprehensiveCTAValue>;
};

const defaultImageStyles: StyledImageValue = {
  borderRadius: "default",
};

const secondaryColor: ThemeColor = {
  selectedColor: "palette-secondary",
  contrastingColor: "palette-secondary-contrast",
};

const createImageField = (): HeroImage => ({
  image: {
    field: "",
    constantValueEnabled: true,
    constantValue: {
      url: "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg",
      width: 1900,
      height: 1267,
    },
  },
  aspectRatio: 1.5,
  imageConstrain: "filled",
  styles: defaultImageStyles,
});

const createHeroCta = (
  label: string,
  link: string,
  color: ThemeColor,
): Partial<ComprehensiveCTAValue> => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValueEnabled: true,
      constantValue: {
        ctaType: "textAndLink",
        label: { defaultValue: label },
        link: { defaultValue: link },
        linkType: "URL",
      },
      selectedType: "textAndLink",
    },
    openInNewTab: false,
    buttonText: { defaultValue: label },
    customId: "",
    customClass: "",
    dataAttributes: [],
    ariaLabel: { defaultValue: label },
  },
  styles: {
    variant: "primary",
    color,
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
  },
});

const IndividualPracticeHeroSectionFields: YextFields<IndividualPracticeHeroSectionProps> =
  {
    section: sectionField,
    cardBackgroundColor: {
      label: msg("fields.cardBackgroundColor", "Card Background Color"),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    hoursStatusBackgroundColor: {
      label: msg("fields.backgroundColor", "Background Color"),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    hours: {
      type: "entityField",
      label: msg("fields.hours", "Hours"),
      filter: {
        types: ["type.hours"],
      },
      disableConstantValueToggle: true,
    },
    hoursStyles: {
      label: msg("fields.hoursStyles", "Hours Styles"),
      type: "object",
      objectFields: {
        showCurrentStatus: {
          label: msg("fields.showCurrentStatus", "Show Current Status"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        timeFormat: {
          label: msg("fields.timeFormat", "Time Format"),
          type: "select",
          options: [
            { label: msg("fields.options.hour12", "12-hour"), value: "12h" },
            { label: msg("fields.options.hour24", "24-hour"), value: "24h" },
          ],
        },
        dayOfWeekFormat: {
          label: msg("fields.dayOfWeekFormat", "Day of Week Format"),
          type: "select",
          options: [
            { label: msg("fields.options.short", "Short"), value: "short" },
            { label: msg("fields.options.long", "Long"), value: "long" },
          ],
        },
        showDayNames: {
          label: msg("fields.showDayNames", "Show Day Names"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    heading: {
      label: msg("fields.heading", "Heading"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    subheading: {
      label: msg("fields.subheading", "Subheading"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    body: {
      label: msg("fields.body", "Body"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    heroImage: {
      label: msg("fields.heroImage", "Hero Image"),
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: msg("fields.image", "Image"),
          filter: {
            types: ["type.image"],
          },
        },
        aspectRatio: {
          label: msg("fields.aspectRatio", "Aspect Ratio"),
          type: "basicSelector",
          options: aspectRatioOptions,
        },
        imageConstrain: {
          label: msg("fields.imageConstrain", "Image Constrain"),
          type: "select",
          options: [
            { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
            { label: msg("fields.options.filled", "Filled"), value: "filled" },
          ],
        },
        styles: {
          label: msg("fields.imageStyles", "Image Styles"),
          type: "styledImage",
        },
      },
    },
    primaryCta: {
      label: msg("fields.primaryCTA", "Primary CTA"),
      type: "comprehensiveCTA",
    },
    secondaryCta: {
      label: msg("fields.secondaryCTA", "Secondary CTA"),
      type: "comprehensiveCTA",
    },
    tertiaryCta: {
      label: msg("fields.tertiaryCta", "Tertiary CTA"),
      type: "comprehensiveCTA",
    },
  };

const IndividualPracticeHeroSectionComponent: PuckComponent<IndividualPracticeHeroSectionProps> =
  (props) => {
    const { t, i18n } = useTranslation();
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const cardCtaForegroundColor = getDefaultForegroundColor(
      props.cardBackgroundColor,
      streamDocument,
    );
    const heroCtas = [
      props.primaryCta,
      props.secondaryCta,
      props.tertiaryCta,
    ].map((cta) => {
      const ctaVariant = cta.styles?.variant;
      const ctaColor = cta.styles?.color;

      return (ctaVariant === "secondary" || ctaVariant === "link") &&
        (!ctaColor || ctaColor.selectedColor === "default") &&
        cardCtaForegroundColor
        ? {
            ...cta,
            styles: {
              ...cta.styles,
              color: cardCtaForegroundColor,
            },
          }
        : cta;
    });
    const resolvedHeading =
      resolveComponentData(props.heading.text, locale, streamDocument)?.toString() ??
      "";
    const resolvedSubheading =
      resolveComponentData(
        props.subheading.text,
        locale,
        streamDocument,
      )?.toString() ?? "";
    const cardForeground = getThemeColorCssValue(
      props.cardBackgroundColor.contrastingColor,
    );
    const hoursStatusBackgroundColor =
      props.hoursStatusBackgroundColor ?? secondaryColor;
    const hoursStatusForeground = getThemeColorCssValue(
      hoursStatusBackgroundColor.contrastingColor,
    );
    const heroBodyStyleOverrides = {
      color: props.body.fontColor
        ? getThemeColorCssValue(props.body.fontColor)
        : cardForeground,
    };
    const heading =
      resolvedHeading;
    const subheading =
      resolvedSubheading;
    const body = resolveComponentData(props.body.text, locale, streamDocument);
    const resolvedHours = resolveComponentData(
      props.hours,
      locale,
      streamDocument,
    );
    const statusTemplate = (params: StatusParams) => {
      const isComingSoon = Boolean(params.comingSoon);
      const isOpen24Hours = Boolean(params.currentInterval?.is24h?.());
      const isIndefinitelyClosed = !params.futureInterval;
      const hasFutureStatus = !isOpen24Hours && !isIndefinitelyClosed;
      const interval = params.isOpen
        ? params.currentInterval
        : params.futureInterval;
      const time = params.isOpen
        ? (interval?.getEndTime(i18n.language, params.timeOptions) ?? "")
        : (interval?.getStartTime(i18n.language, params.timeOptions) ?? "");
      const dayOfWeek = props.hoursStyles.showDayNames
        ? params.isOpen
          ? (interval?.end
              ?.setLocale(i18n.language)
              .toLocaleString(params.dayOptions) ?? "")
          : (interval?.start
              ?.setLocale(i18n.language)
              .toLocaleString(params.dayOptions) ?? "")
        : "";
      const currentStatus = params.comingSoon
        ? t("comingSoon", "Coming Soon")
        : isOpen24Hours
          ? t("open24Hours", "Open 24 Hours")
          : isIndefinitelyClosed
            ? t("temporarilyClosed", "Temporarily Closed")
            : params.isOpen
              ? t("openNow", "Open Now")
              : t("closed", "Closed");
      const futureStatus =
        !isComingSoon && hasFutureStatus && time
          ? params.isOpen
            ? dayOfWeek
              ? t(
                  "closesAtTimeWeek",
                  "Closes at {{time}} {{dayOfWeek}}",
                  { time, dayOfWeek },
                )
              : t("closesAtTime", "Closes at {{time}}", { time })
            : dayOfWeek
              ? t(
                  "opensAtTimeWeek",
                  "Opens at {{time}} {{dayOfWeek}}",
                  { time, dayOfWeek },
                )
              : t("opensAtTime", "Opens at {{time}}", { time })
          : "";

      return (
        <span
          style={{
            ...getSurfaceColorStyle(
              hoursStatusBackgroundColor,
              streamDocument,
            ),
            borderRadius: "999px",
            color: hoursStatusForeground,
            display: "inline-flex",
            minHeight: "2.45rem",
            padding: "0.35rem 1rem",
          }}
        >
          <span className="HoursStatus-current">{currentStatus}</span>
          {futureStatus ? (
            <>
              <span className="HoursStatus-separator"> • </span>
              <span className="HoursStatus-future">{futureStatus}</span>
            </>
          ) : null}
        </span>
      );
    };
    const heroImage = resolveComponentData(
      props.heroImage.image,
      locale,
      streamDocument,
    ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
    const heroImageBorderRadius =
      props.heroImage.styles?.borderRadius === "default"
        ? "16px"
        : props.heroImage.styles?.borderRadius;

    return (
      <VisibilityWrapper
        isEditing={props.puck.isEditing}
        liveVisibility={props.section.visibleOnLivePage}
      >
        <style>{`
          .yip-hero-root p {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-hero-root li {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-hero-root h1 {
            font-family: var(--fontFamily-h1-fontFamily);
            font-size: var(--fontSize-h1-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h1-fontWeight);
            font-style: var(--fontStyle-h1-fontStyle);
            text-transform: var(--textTransform-h1-textTransform);
          }

          .yip-hero-root h2 {
            font-family: var(--fontFamily-h2-fontFamily);
            font-size: var(--fontSize-h2-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h2-fontWeight);
            font-style: var(--fontStyle-h2-fontStyle);
            text-transform: var(--textTransform-h2-textTransform);
          }

          .yip-hero-root h3 {
            font-family: var(--fontFamily-h3-fontFamily);
            font-size: var(--fontSize-h3-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h3-fontWeight);
            font-style: var(--fontStyle-h3-fontStyle);
            text-transform: var(--textTransform-h3-textTransform);
          }

          .yip-hero-root h4 {
            font-family: var(--fontFamily-h4-fontFamily);
            font-size: var(--fontSize-h4-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h4-fontWeight);
            font-style: var(--fontStyle-h4-fontStyle);
            text-transform: var(--textTransform-h4-textTransform);
          }

          .yip-hero-root h5 {
            font-family: var(--fontFamily-h5-fontFamily);
            font-size: var(--fontSize-h5-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h5-fontWeight);
            font-style: var(--fontStyle-h5-fontStyle);
            text-transform: var(--textTransform-h5-textTransform);
          }

          .yip-hero-root h6 {
            font-family: var(--fontFamily-h6-fontFamily);
            font-size: var(--fontSize-h6-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h6-fontWeight);
            font-style: var(--fontStyle-h6-fontStyle);
            text-transform: var(--textTransform-h6-textTransform);
          }

          .yip-hero-root a.yip-hero-text-link,
          .yip-hero-root .yip-hero-rich-text a {
            font-family: var(--fontFamily-link-fontFamily);
            font-size: var(--fontSize-link-fontSize);
            font-weight: var(--fontWeight-link-fontWeight);
            font-style: var(--fontStyle-link-fontStyle);
            line-height: 1.5;
            text-decoration: underline;
            text-transform: var(--textTransform-link-textTransform);
            letter-spacing: var(--letterSpacing-link-letterSpacing);
          }

          @media (max-width: 64rem) {
            .yip-hero-card {
              grid-template-columns: 1fr !important;
            }

            .yip-hero-media {
              order: -1;
            }
          }

          @media (max-width: 48rem) {
            .yip-hero-actions {
              flex-direction: column;
            }

            .yip-hero-actions > * {
              width: 100%;
            }
          }
        `}</style>
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yip-hero-root px-4 py-pageSection-verticalPadding"
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: "min(100%, 73rem)",
            }}
          >
            <div
              className="yip-hero-card"
              style={{
                alignItems: "center",
                ...getSurfaceColorStyle(
                  props.cardBackgroundColor,
                  streamDocument,
                ),
                borderRadius: "20px",
                display: "grid",
                gap: "clamp(1.5rem, 3vw, 3.75rem)",
                gridTemplateColumns: "minmax(0, 1.1fr) minmax(18rem, 35%)",
                padding: "clamp(1.5rem, 3vw, 3.75rem)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  {resolvedHours && props.hoursStyles.showCurrentStatus ? (
                    <EntityField
                      displayName="Hours"
                      fieldId={props.hours.field}
                      constantValueEnabled={props.hours.constantValueEnabled}
                    >
                      <HoursStatus
                        hours={resolvedHours}
                        comingSoon={Boolean(streamDocument.comingSoon)}
                        timezone={
                          typeof streamDocument.timezone === "string"
                            ? streamDocument.timezone
                            : "America/New_York"
                        }
                        timeOptions={{
                          hour12: props.hoursStyles.timeFormat === "12h",
                        }}
                        dayOptions={{
                          weekday: props.hoursStyles.dayOfWeekFormat,
                        }}
                        statusTemplate={statusTemplate}
                      />
                    </EntityField>
                  ) : null}
                </div>
                <div>
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={props.heading.text.constantValueEnabled}
                  >
                    <h1
                      style={{
                        color: props.heading.fontColor
                          ? getThemeColorCssValue(props.heading.fontColor)
                          : cardForeground,
                        fontFamily:
                          props.heading.styles.fontFamily === "default"
                            ? undefined
                            : props.heading.styles.fontFamily,
                        fontSize:
                          props.heading.styles.fontSize === "default"
                            ? "clamp(2.4rem, 4.6vw, 4rem)"
                            : props.heading.styles.fontSize,
                        fontStyle:
                          props.heading.styles.fontStyle === "default"
                            ? undefined
                            : props.heading.styles.fontStyle,
                        fontWeight:
                          props.heading.styles.fontWeight === "default"
                            ? undefined
                            : props.heading.styles.fontWeight,
                        letterSpacing: "-0.05em",
                        lineHeight: 1.06,
                        margin: 0,
                        maxWidth: "15ch",
                        textTransform:
                          props.heading.styles.textTransform === "default"
                            ? undefined
                            : props.heading.styles.textTransform,
                      }}
                    >
                      {heading}
                    </h1>
                  </EntityField>
                  <EntityField
                    displayName="Subheading"
                    fieldId={props.subheading.text.field}
                    constantValueEnabled={props.subheading.text.constantValueEnabled}
                  >
                    <h2
                      style={{
                        color: props.subheading.fontColor
                          ? getThemeColorCssValue(props.subheading.fontColor)
                          : cardForeground,
                        fontFamily:
                          props.subheading.styles.fontFamily === "default"
                            ? undefined
                            : props.subheading.styles.fontFamily,
                        fontSize:
                          props.subheading.styles.fontSize === "default"
                            ? "clamp(1.25rem, 2.2vw, 1.9rem)"
                            : props.subheading.styles.fontSize,
                        fontStyle:
                          props.subheading.styles.fontStyle === "default"
                            ? undefined
                            : props.subheading.styles.fontStyle,
                        fontWeight:
                          props.subheading.styles.fontWeight === "default"
                            ? 500
                            : props.subheading.styles.fontWeight,
                        margin: "14px 0 0",
                        textTransform:
                          props.subheading.styles.textTransform === "default"
                            ? undefined
                            : props.subheading.styles.textTransform,
                      }}
                    >
                      {subheading}
                    </h2>
                  </EntityField>
                </div>
                <EntityField
                  displayName="Body"
                  fieldId={props.body.text.field}
                  constantValueEnabled={props.body.text.constantValueEnabled}
                >
                  <div
                    className="yip-hero-rich-text"
                    style={{
                      lineHeight: 1.6,
                      margin: 0,
                      maxWidth: "40rem",
                    }}
                  >
                    {renderRichText(body, heroBodyStyleOverrides)}
                  </div>
                </EntityField>
                <div
                  className="yip-hero-actions"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <EntityField
                    displayName="Primary Call to Action"
                    fieldId={props.primaryCta.data?.cta?.field}
                    constantValueEnabled={
                      props.primaryCta.data?.cta?.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={heroCtas[0] as Partial<ComprehensiveCTAValue>}
                      eventName="getDirections"
                    />
                  </EntityField>
                  <EntityField
                    displayName="Secondary Call to Action"
                    fieldId={props.secondaryCta.data?.cta?.field}
                    constantValueEnabled={
                      props.secondaryCta.data?.cta?.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={heroCtas[1] as Partial<ComprehensiveCTAValue>}
                      eventName="secondaryCta"
                    />
                  </EntityField>
                  <EntityField
                    displayName="Tertiary Call to Action"
                    fieldId={props.tertiaryCta.data?.cta?.field}
                    constantValueEnabled={
                      props.tertiaryCta.data?.cta?.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={heroCtas[2] as Partial<ComprehensiveCTAValue>}
                      eventName="tertiaryCta"
                    />
                  </EntityField>
                </div>
              </div>
              {heroImage ? (
                <EntityField
                  displayName="Hero Image"
                  fieldId={props.heroImage.image.field}
                  constantValueEnabled={
                    props.heroImage.image.constantValueEnabled
                  }
                >
                  <div
                    className="yip-hero-media"
                    style={{
                      aspectRatio:
                        props.heroImage.aspectRatio > 0
                          ? props.heroImage.aspectRatio
                          : undefined,
                      borderRadius: heroImageBorderRadius,
                      height:
                        props.heroImage.aspectRatio > 0 ? undefined : "21rem",
                      maxWidth: "100%",
                      minWidth: 0,
                      overflow:
                        props.heroImage.imageConstrain === "filled" ||
                        Boolean(heroImageBorderRadius)
                          ? "hidden"
                          : undefined,
                      width: "100%",
                    }}
                  >
                    <Image
                      image={heroImage}
                      className={
                        props.heroImage.aspectRatio > 0 ? "h-full" : undefined
                      }
                      style={{
                        display: "block",
                        height:
                          props.heroImage.aspectRatio > 0 ? "100%" : "auto",
                        objectFit:
                          props.heroImage.imageConstrain === "filled"
                            ? "cover"
                            : "contain",
                        width: "100%",
                      }}
                    />
                  </div>
                </EntityField>
              ) : null}
            </div>
          </div>
        </Background>
      </VisibilityWrapper>
    );
  };

export const IndividualPracticeHeroSection: YextComponentConfig<IndividualPracticeHeroSectionProps> =
  {
    label: "Hero Section",
    fields: IndividualPracticeHeroSectionFields,
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      cardBackgroundColor: whiteBackground,
      hoursStatusBackgroundColor: secondaryColor,
      hours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      },
      hoursStyles: {
        showCurrentStatus: true,
        timeFormat: "12h",
        dayOfWeekFormat: "long",
        showDayNames: true,
      },
      heading: {
        text: {
          field: "name",
          constantValue: {
            defaultValue: "",
          },
          constantValueEnabled: false,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      subheading: {
        text: {
          field: "geomodifier",
          constantValue: {
            defaultValue: "",
          },
          constantValueEnabled: false,
        },
        styles: defaultTextStyles,
        fontColor: primaryColor,
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "[[name]] provides high-acuity urgent care, comprehensive family medicine, and emergency stabilization services. Our state-of-the-art facility is staffed by board-certified emergency physicians and family practitioners dedicated to immediate, high-quality care for the South Shore community.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      heroImage: createImageField(),
      primaryCta: createHeroCta("Get Directions", "#", primaryColor),
      secondaryCta: createHeroCta("Find Care", "#", secondaryColor),
      tertiaryCta: createHeroCta(
        "Find Patient Resources",
        "#resources",
        whiteBackground,
      ),
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeHeroSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeHeroSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeHeroSection",
  displayName: "Hero Section",
  description: "Hero Section",
  pageSetTypes: ["ENTITY"],
};
