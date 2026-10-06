import "../shared/typography.css";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";
import {
  msg,
  Background,
  ComprehensiveCTA,
  createItemSource,
  type EnhancedTranslatableCTA,
  type ComprehensiveCTAValue,
  EntityField,
  getDefaultForegroundColor,
  getDefaultRTF,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  Image,
  resolveComponentData,
  type StyledButtonValue,
  type StyledLinkValue,
  type StyledTextValue,
  type StyledImageValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextCTAField,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  aspectRatioOptions,
  createTextField as createEntityTextField,
  defaultTextStyles,
  renderRichText,
  getExplicitTextColorCssValue,
  sectionField,
  whiteBackground,
} from "../shared/sectionHelpers";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type ServiceTextProps = {
  text: YextEntityField<TranslatableString>;
};

type ServiceRtfProps = {
  text: YextEntityField<TranslatableRichText>;
};

type MedicalServicesCtaStyles = {
  variant: "primary" | "secondary" | "link";
  color?: ThemeColor;
  button?: StyledButtonValue;
  link?: StyledLinkValue;
};

type MedicalServicesCardStyles = {
  cardBackgroundColor: ThemeColor;
  titleTextStyles: StyledTextValue;
  titleFontColor?: ThemeColor;
  descriptionFontColor?: ThemeColor;
  imageStyles?: StyledImageValue;
  imageAspectRatio: number;
  imageConstrain: "fixed" | "filled";
  ctaStyles: MedicalServicesCtaStyles;
};

type ServiceItem = {
  title: ServiceTextProps;
  description: ServiceRtfProps;
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  cta: YextCTAField;
};

type IndividualPracticeMedicalServicesSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  cardStyles: MedicalServicesCardStyles;
  items: typeof serviceItemsSource.value;
};

const defaultImageStyles: StyledImageValue = {
  borderRadius: "default",
};

const createImageField = (
  url: string,
  width: number,
  height: number,
): YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage> => ({
  field: "",
  constantValueEnabled: true,
  constantValue: {
    url,
    width,
    height,
  },
});

const createTextField = (
  defaultValue: string,
  fontColor?: ThemeColor,
): StyledTextProps => ({
  text: createEntityTextField(defaultValue),
  styles: defaultTextStyles,
  fontColor,
});

const createServiceTextField = (defaultValue: string): ServiceTextProps => ({
  text: createEntityTextField(defaultValue),
});

const createRtfField = (defaultValue: string): ServiceRtfProps => ({
  text: {
    field: "",
    constantValue: {
      defaultValue: getDefaultRTF(defaultValue),
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
});

const createTextCtaField = (label: string): YextCTAField => ({
  field: "",
  constantValueEnabled: true,
  constantValue: {
    ctaType: "textAndLink",
    label: { defaultValue: label },
    link: { defaultValue: "#" },
    linkType: "URL",
    openInNewTab: false,
  },
  selectedType: "textAndLink",
});

const createTextCtaStyles = (): MedicalServicesCtaStyles => ({
  variant: "secondary",
  button: {
    fontFamily: "default",
    fontSize: "default",
    fontWeight: "default",
    fontStyle: "default",
    textTransform: "default",
    letterSpacing: "default",
    borderRadius: "default",
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

const serviceItemsSource = createItemSource<ServiceItem>({
  label: msg("fields.services", "Services"),
  mappingFields: {
    title: {
      label: msg("fields.title", "Title"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: { types: ["type.string"] },
        },
      },
    },
    description: {
      label: msg("fields.description", "Description"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: { types: ["type.rich_text_v2"] },
        },
      },
    },
    image: {
      type: "entityField",
      label: msg("fields.image", "Image"),
      filter: { types: ["type.image"] },
    },
    cta: { label: msg("fields.callToAction", "Call to Action"), type: "ctaSelector" },
  },
  defaultValues: [
    {
      title: createServiceTextField("Urgent Care & Express Care"),
      description: createRtfField(
        "Immediate treatment for non-life-threatening illnesses and injuries including fractures, lacerations requiring stitches, infections, and respiratory issues. No appointment necessary.",
      ),
      image: createImageField(
        "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
        1900,
        1267,
      ),
      cta: createTextCtaField("Check In Online"),
    },
    {
      title: createServiceTextField("Primary & Family Medicine"),
      description: createRtfField(
        "Comprehensive longitudinal care for the whole family, from newborn pediatrics to geriatric medicine, focusing on wellness and chronic disease management.",
      ),
      image: createImageField(
        "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
        1900,
        1267,
      ),
      cta: createTextCtaField("Schedule a New Patient Visit"),
    },
    {
      title: createServiceTextField("Occupational Health"),
      description: createRtfField(
        "Work-related injury care, DOT physicals, pre-employment screenings, and drug testing for local businesses.",
      ),
      image: createImageField(
        "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
        1900,
        1267,
      ),
      cta: createTextCtaField("Employer Resources"),
    },
    {
      title: createServiceTextField("Laboratory & Imaging"),
      description: createRtfField(
        "Fast-turnaround diagnostic services. Most lab results are available within 24 hours via the Patient Portal.",
      ),
      image: createImageField(
        "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
        1900,
        1267,
      ),
      cta: createTextCtaField("View Test Preparation Guide"),
    },
  ],
});

const IndividualPracticeMedicalServicesSectionFields: YextFields<IndividualPracticeMedicalServicesSectionProps> =
  {
    section: sectionField,
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
    cardStyles: {
      label: msg("fields.cardStyles", "Card Styles"),
      type: "object",
      objectFields: {
        cardBackgroundColor: {
          label: msg("fields.cardBackgroundColor", "Card Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        titleTextStyles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        titleFontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        descriptionFontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        imageStyles: {
          label: msg("fields.imageStyles", "Image Styles"),
          type: "styledImage",
        },
        imageAspectRatio: {
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
        ctaStyles: {
          label: msg("fields.callToActionStyles", "Call to Action Styles"),
          type: "object",
          objectFields: {
            variant: {
              label: msg("fields.variant", "Variant"),
              type: "radio",
              options: [
                { label: msg("fields.options.solid", "Solid"), value: "primary" },
                { label: msg("fields.options.outline", "Outline"), value: "secondary" },
                { label: msg("fields.options.link", "Link"), value: "link" },
              ],
            },
            color: {
              label: msg("fields.color", "Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            button: {
              label: msg("fields.buttonStyles", "Button Styles"),
              type: "styledButton",
            },
            link: {
              label: msg("fields.linkStyles", "Link Styles"),
              type: "styledLink",
              showIncludeCaretField: true,
            },
          },
        },
      },
    },
    items: serviceItemsSource.field,
  };

const createRenderedCta = (
  resolvedCta: EnhancedTranslatableCTA | undefined,
  styles: MedicalServicesCtaStyles,
): Partial<ComprehensiveCTAValue> => {
  const constantValue: EnhancedTranslatableCTA = resolvedCta ?? {
    ctaType: "textAndLink",
    label: { defaultValue: "" },
    link: { defaultValue: "" },
    linkType: "URL",
  };
  const cta: YextCTAField = {
    field: "",
    constantValue,
    constantValueEnabled: true,
    selectedType: constantValue.ctaType,
  };
  const label = constantValue.label;
  const openInNewTab = constantValue.openInNewTab ?? false;

  return {
    data: {
      actionType: "link",
      cta,
      openInNewTab,
      buttonText: label,
      customId: "",
      customClass: "",
      dataAttributes: [],
      ariaLabel: label,
    },
    styles,
  };
};

const IndividualPracticeMedicalServicesSectionComponent: PuckComponent<
  IndividualPracticeMedicalServicesSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const heading =
    resolveComponentData(
      props.heading.text,
      locale,
      streamDocument,
    )?.toString() ?? "";
  const titleStyles = props.cardStyles.titleTextStyles;
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
  );
  const cardSurfaceStyle = getSurfaceColorStyle(
    props.cardStyles.cardBackgroundColor,
    streamDocument,
  );
  const cardForeground = getThemeColorCssValue(
    props.cardStyles.cardBackgroundColor.contrastingColor,
  );
  const cardCtaForegroundColor = getDefaultForegroundColor(
    props.cardStyles.cardBackgroundColor,
    streamDocument,
  );
  const cardShadow = `0 20px 48px color-mix(in srgb, ${cardForeground} 6%, transparent)`;
  const items = serviceItemsSource.resolveItems(props.items, streamDocument);

  return (
    <VisibilityWrapper
      isEditing={props.puck.isEditing}
      liveVisibility={props.section.visibleOnLivePage}
    >
      <style>{`
          .yip-medical-services-root p {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-medical-services-root li {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-medical-services-root h1 {
            font-family: var(--fontFamily-h1-fontFamily);
            font-size: var(--fontSize-h1-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h1-fontWeight);
            font-style: var(--fontStyle-h1-fontStyle);
            text-transform: var(--textTransform-h1-textTransform);
          }

          .yip-medical-services-root h2 {
            font-family: var(--fontFamily-h2-fontFamily);
            font-size: var(--fontSize-h2-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h2-fontWeight);
            font-style: var(--fontStyle-h2-fontStyle);
            text-transform: var(--textTransform-h2-textTransform);
          }

          .yip-medical-services-root h3 {
            font-family: var(--fontFamily-h3-fontFamily);
            font-size: var(--fontSize-h3-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h3-fontWeight);
            font-style: var(--fontStyle-h3-fontStyle);
            text-transform: var(--textTransform-h3-textTransform);
          }

          .yip-medical-services-root h4 {
            font-family: var(--fontFamily-h4-fontFamily);
            font-size: var(--fontSize-h4-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h4-fontWeight);
            font-style: var(--fontStyle-h4-fontStyle);
            text-transform: var(--textTransform-h4-textTransform);
          }

          .yip-medical-services-root h5 {
            font-family: var(--fontFamily-h5-fontFamily);
            font-size: var(--fontSize-h5-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h5-fontWeight);
            font-style: var(--fontStyle-h5-fontStyle);
            text-transform: var(--textTransform-h5-textTransform);
          }

          .yip-medical-services-root h6 {
            font-family: var(--fontFamily-h6-fontFamily);
            font-size: var(--fontSize-h6-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h6-fontWeight);
            font-style: var(--fontStyle-h6-fontStyle);
            text-transform: var(--textTransform-h6-textTransform);
          }

          .yip-medical-services-root a.yip-medical-services-text-link,
          .yip-medical-services-root .yip-medical-services-rich-text a {
            font-family: var(--fontFamily-link-fontFamily);
            font-size: var(--fontSize-link-fontSize);
            font-weight: var(--fontWeight-link-fontWeight);
            font-style: var(--fontStyle-link-fontStyle);
            line-height: 1.5;
            text-decoration: underline;
            text-transform: var(--textTransform-link-textTransform);
            letter-spacing: var(--letterSpacing-link-letterSpacing);
          }

          @media (max-width: 48rem) {
            .yip-medical-services-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      <Background
        as="section"
        background={props.section.backgroundColor}
        id="specialties"
        className="yip-medical-services-root px-4 py-pageSection-verticalPadding"
        style={{
          ...sectionSurfaceStyle,
        }}
      >
        <div
          style={{
            margin: "0 auto",
            width: "min(100%, var(--maxWidth-pageSection-contentWidth))",
          }}
        >
          <div
            style={{
              marginBottom: "48px",
              textAlign: "center",
            }}
          >
            <EntityField
              displayName="Heading"
              fieldId={props.heading.text.field}
              constantValueEnabled={props.heading.text.constantValueEnabled}
            >
              <h2
                style={{
                  color: getExplicitTextColorCssValue(props.heading.fontColor) ??
                    getThemeColorCssValue(props.section.backgroundColor.contrastingColor),
                  fontFamily:
                    props.heading.styles.fontFamily === "default"
                      ? undefined
                      : props.heading.styles.fontFamily,
                  fontSize:
                    props.heading.styles.fontSize === "default"
                      ? undefined
                      : props.heading.styles.fontSize,
                  fontStyle:
                    props.heading.styles.fontStyle === "default"
                      ? undefined
                      : props.heading.styles.fontStyle,
                  fontWeight:
                    props.heading.styles.fontWeight === "default"
                      ? undefined
                      : props.heading.styles.fontWeight,
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
          <EntityField
            displayName="Services"
            fieldId={props.items.field}
            constantValueEnabled={props.items.constantValueEnabled}
          >
            <div
              className="yip-medical-services-grid"
              style={{
                display: "grid",
                gap: "24px",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              }}
            >
              {items.map((item, index) => {
                const title = resolveComponentData(
                  item.title.text,
                  locale,
                  streamDocument,
                  { output: "plainText" },
                );
                const descriptionStyleOverrides = {
                  color: props.cardStyles.descriptionFontColor
                    ? getExplicitTextColorCssValue(props.cardStyles.descriptionFontColor)
                    : cardForeground,
                };
                const description = item.description.text
                  ? resolveComponentData(
                      item.description.text,
                      locale,
                      streamDocument,
                    )
                  : undefined;
                const image = item.image as
                  | ImageType
                  | ComplexImageType
                  | TranslatableAssetImage
                  | undefined;
                const imageBorderRadius =
                  props.cardStyles.imageStyles?.borderRadius && props.cardStyles.imageStyles?.borderRadius !== "default"
                    ? props.cardStyles.imageStyles?.borderRadius
                    : "var(--borderRadius-image-borderRadius)";
                const sharedCtaStyles = props.cardStyles.ctaStyles;
                const ctaVariant = sharedCtaStyles?.variant;
                const ctaColor = sharedCtaStyles?.color;
                const renderedCtaStyles =
                  (ctaVariant === "secondary" || ctaVariant === "link") &&
                  (!ctaColor || ctaColor.selectedColor === "default") &&
                  cardCtaForegroundColor
                    ? { ...sharedCtaStyles, color: cardCtaForegroundColor }
                    : sharedCtaStyles;
                const renderedCta = createRenderedCta(
                  item.cta,
                  renderedCtaStyles,
                );

                return (
                  <article
                    key={`${title}-${index}`}
                    style={{
                      ...cardSurfaceStyle,
                      borderRadius: "20px",
                      boxShadow: cardShadow,
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        padding: "10px",
                      }}
                    >
                      <h3
                        style={{
                          color: getExplicitTextColorCssValue(props.cardStyles.titleFontColor) ??
                    getThemeColorCssValue(props.cardStyles.cardBackgroundColor.contrastingColor),
                          fontFamily:
                            titleStyles.fontFamily === "default"
                              ? undefined
                              : titleStyles.fontFamily,
                          fontSize:
                            titleStyles.fontSize === "default"
                              ? undefined
                              : titleStyles.fontSize,
                          fontStyle:
                            titleStyles.fontStyle === "default"
                              ? undefined
                              : titleStyles.fontStyle,
                          fontWeight:
                            titleStyles.fontWeight === "default"
                              ? undefined
                              : titleStyles.fontWeight,
                          lineHeight: 1.2,
                                                    margin: 0,
                          textTransform:
                            titleStyles.textTransform === "default"
                              ? undefined
                              : titleStyles.textTransform,
                        }}
                      >
                        {title}
                      </h3>
                      <div
                        className="yip-medical-services-rich-text"
                        style={{
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {renderRichText(
                          description,
                          descriptionStyleOverrides,
                        )}
                      </div>
                    </div>
                    {image ? (
                      <div
                        style={{
                          aspectRatio:
                            props.cardStyles.imageAspectRatio > 0
                              ? props.cardStyles.imageAspectRatio
                              : undefined,
                          borderRadius: imageBorderRadius,
                          maxWidth: "100%",
                          minWidth: 0,
                          overflow:
                            props.cardStyles.imageConstrain === "filled" ||
                            Boolean(imageBorderRadius)
                              ? "hidden"
                              : undefined,
                          width: "100%",
                        }}
                      >
                        <Image
                          image={image}
                          className={
                            props.cardStyles.imageAspectRatio > 0
                              ? "h-full"
                              : undefined
                          }
                          style={{
                            display: "block",
                            height:
                              props.cardStyles.imageAspectRatio > 0
                                ? "100%"
                                : "auto",
                            objectFit:
                              props.cardStyles.imageConstrain === "filled"
                                ? "cover"
                                : "contain",
                            width: "100%",
                          }}
                        />
                      </div>
                    ) : null}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "0 10px 10px",
                      }}
                    >
                      <ComprehensiveCTA
                        value={renderedCta}
                        eventName={`serviceCta-${index}`}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </EntityField>
        </div>
      </Background>
    </VisibilityWrapper>
  );
};

export const IndividualPracticeMedicalServicesSection: YextComponentConfig<IndividualPracticeMedicalServicesSectionProps> =
  {
    label: msg("components.medicalServices", "Medical Services"),
    fields: IndividualPracticeMedicalServicesSectionFields,
    resolveFields: (data, { fields }) => {
      const cardStylesField = fields.cardStyles as typeof fields.cardStyles & {
        objectFields: {
          ctaStyles: {
            objectFields: {
              button: { visible?: boolean };
              link: { visible?: boolean };
            };
          };
        };
      };
      const variant = data.props.cardStyles?.ctaStyles?.variant ?? "secondary";
      const showButtonStyles = variant === "primary" || variant === "secondary";
      const showLinkStyles = variant === "link";

      return {
        ...fields,
        cardStyles: {
          ...cardStylesField,
          objectFields: {
            ...cardStylesField.objectFields,
            ctaStyles: {
              ...cardStylesField.objectFields.ctaStyles,
              objectFields: {
                ...cardStylesField.objectFields.ctaStyles.objectFields,
                button: {
                  ...cardStylesField.objectFields.ctaStyles.objectFields.button,
                  visible: showButtonStyles,
                },
                link: {
                  ...cardStylesField.objectFields.ctaStyles.objectFields.link,
                  visible: showLinkStyles,
                },
              },
            },
          },
        } as typeof fields.cardStyles,
      };
    },
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      heading: createTextField("Medical Services"),
      cardStyles: {
        cardBackgroundColor: whiteBackground,
        titleTextStyles: defaultTextStyles,
        imageStyles: defaultImageStyles,
        imageAspectRatio: 1.5,
        imageConstrain: "filled",
        ctaStyles: createTextCtaStyles(),
      },
      items: serviceItemsSource.defaultValue,
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeMedicalServicesSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeMedicalServicesSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeMedicalServicesSection",
  displayName: "Medical Services",
  description: "Medical Services",
  pageSetTypes: ["ENTITY"],
};
