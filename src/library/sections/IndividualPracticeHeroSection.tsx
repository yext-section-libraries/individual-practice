import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  HoursStatus,
  type ComplexImageType,
  type HoursType,
  type ImageType,
  type StatusParams,
} from "@yext/pages-components";
import {
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  getDefaultForegroundColor,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getThemeColorCssValue,
  Image,
  MaybeRTF,
  resolveComponentData,
  type StyledTextValue,
  type StyledImageValue,
  type ThemeColor,
  ThemeOptions,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

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

const whiteBackground: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const defaultImageStyles: StyledImageValue = {
  borderRadius: "default",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const primaryColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
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
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    hoursStatusBackgroundColor: {
      label: "Hours Status Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    hours: {
      type: "entityField",
      label: "Hours",
      filter: {
        types: ["type.hours"],
      },
      disableConstantValueToggle: true,
    },
    hoursStyles: {
      label: "Hours Styles",
      type: "object",
      objectFields: {
        showCurrentStatus: {
          label: "Show Current Status",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        timeFormat: {
          label: "Time Format",
          type: "select",
          options: [
            { label: "12 Hour", value: "12h" },
            { label: "24 Hour", value: "24h" },
          ],
        },
        dayOfWeekFormat: {
          label: "Day Of Week Format",
          type: "select",
          options: [
            { label: "Short", value: "short" },
            { label: "Long", value: "long" },
          ],
        },
        showDayNames: {
          label: "Show Day Names",
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
    subheading: {
      label: "Subheading",
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
    body: {
      label: "Body",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    heroImage: {
      label: "Hero Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: {
            types: ["type.image"],
          },
        },
        aspectRatio: {
          label: "Aspect Ratio",
          type: "basicSelector",
          options: ThemeOptions.ASPECT_RATIO,
        },
        imageConstrain: {
          label: "Image Constrain",
          type: "select",
          options: [
            { label: "Fixed", value: "fixed" },
            { label: "Filled", value: "filled" },
          ],
        },
        styles: {
          label: "Image Styles",
          type: "styledImage",
        },
      },
    },
    primaryCta: {
      label: "Primary CTA",
      type: "comprehensiveCTA",
    },
    secondaryCta: {
      label: "Secondary CTA",
      type: "comprehensiveCTA",
    },
    tertiaryCta: {
      label: "Tertiary CTA",
      type: "comprehensiveCTA",
    },
  };

const IndividualPracticeHeroSectionComponent: PuckComponent<IndividualPracticeHeroSectionProps> =
  (props) => {
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
    const body = resolveComponentData(
      props.body.text,
      locale,
      streamDocument,
      {
        richTextStyleOverrides: heroBodyStyleOverrides,
      },
    );
    const resolvedHours = resolveComponentData(
      props.hours,
      locale,
      streamDocument,
    );
    const currentStatusTemplate = ({ isOpen }: StatusParams) => (
      <span
        style={{
          backgroundColor: getThemeColorCssValue(hoursStatusBackgroundColor),
          borderRadius: "999px",
          color: hoursStatusForeground,
          display: "inline-flex",
          minHeight: "2.45rem",
          padding: "0.35rem 1rem",
        }}
      >
        {isOpen ? "Open Now" : "Closed"}
      </span>
    );
    const hideDayOfWeek = () => null;
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
        <section
          className="yip-hero-root px-4 py-pageSection-verticalPadding"
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
              className="yip-hero-card"
              style={{
                alignItems: "center",
                backgroundColor: getThemeColorCssValue(props.cardBackgroundColor),
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
                        currentTemplate={currentStatusTemplate}
                        dayOfWeekTemplate={
                          props.hoursStyles.showDayNames
                            ? undefined
                            : hideDayOfWeek
                        }
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
                    {React.isValidElement(body) ? (
                      body
                    ) : (
                      <MaybeRTF
                        data={typeof body === "string" ? body : ""}
                        richTextStyleOverrides={heroBodyStyleOverrides}
                      />
                    )}
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
        </section>
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
