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
  type ComprehensiveCTAValue,
  EntityField,
  getDefaultForegroundColor,
  getDefaultRTF,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  type StyledTextValue,
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
  getImageData,
  lightTextStyles as defaultTextStyles,
  renderRichText,
  sectionField,
  whiteBackground,
} from "../shared/sectionHelpers";

type ResourceImage = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
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

type ResourceItem = {
  cta: Partial<ComprehensiveCTAValue>;
};

type IndividualPracticePatientResourcesSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  panelBackgroundColor: ThemeColor;
  heading: StyledTextProps;
  body: StyledRtfProps;
  image: ResourceImage;
  items: ResourceItem[];
};

const primaryBackground: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const createImageField = (): ResourceImage => ({
  image: {
    field: "",
    constantValueEnabled: true,
    constantValue: {
      url: "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
      width: 1900,
      height: 1267,
    },
  },
});

const createChipCta = (label: string): Partial<ComprehensiveCTAValue> => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValueEnabled: true,
      constantValue: {
        ctaType: "textAndLink",
        label: { defaultValue: label },
        link: { defaultValue: "#" },
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
  },
});

const IndividualPracticePatientResourcesSectionFields: YextFields<IndividualPracticePatientResourcesSectionProps> =
  {
    section: sectionField,
    panelBackgroundColor: {
      label: msg("fields.panelBackgroundColor", "Panel Background Color"),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
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
    image: {
      label: msg("fields.image", "Image"),
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: msg("fields.image", "Image"),
          filter: {
            types: ["type.image"],
          },
        },
      },
    },
    items: {
      label: msg("fields.items", "Items"),
      type: "array",
      arrayFields: {
        cta: {
          label: msg("fields.callToAction", "Call to Action"),
          type: "comprehensiveCTA",
        },
      },
      defaultItemProps: {
        cta: createChipCta("Resource"),
      },
      getItemSummary: (_item: ResourceItem, index?: number) =>
        `Resource ${index ?? 0}`,
    },
  };

const IndividualPracticePatientResourcesSectionComponent: PuckComponent<IndividualPracticePatientResourcesSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const panelCtaForegroundColor = getDefaultForegroundColor(
      props.panelBackgroundColor,
      streamDocument,
    );
    const heading =
      resolveComponentData(
        props.heading.text,
        locale,
        streamDocument,
      )?.toString() ?? "";
    const panelForeground = getThemeColorCssValue(
      props.panelBackgroundColor.contrastingColor,
    );
    const bodyStyleOverrides = {
      color: props.body.fontColor
        ? getThemeColorCssValue(props.body.fontColor)
        : panelForeground,
    };
    const body = resolveComponentData(props.body.text, locale, streamDocument);
    const image = resolveComponentData(
      props.image.image,
      locale,
      streamDocument,
    ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
    const { src: imageSource, alt: imageAlt } = getImageData(image);

    return (
      <VisibilityWrapper
        isEditing={props.puck.isEditing}
        liveVisibility={props.section.visibleOnLivePage}
      >
        <style>{`
          .yip-patient-resources-root p {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-patient-resources-root li {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-patient-resources-root h1 {
            font-family: var(--fontFamily-h1-fontFamily);
            font-size: var(--fontSize-h1-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h1-fontWeight);
            font-style: var(--fontStyle-h1-fontStyle);
            text-transform: var(--textTransform-h1-textTransform);
          }

          .yip-patient-resources-root h2 {
            font-family: var(--fontFamily-h2-fontFamily);
            font-size: var(--fontSize-h2-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h2-fontWeight);
            font-style: var(--fontStyle-h2-fontStyle);
            text-transform: var(--textTransform-h2-textTransform);
          }

          .yip-patient-resources-root h3 {
            font-family: var(--fontFamily-h3-fontFamily);
            font-size: var(--fontSize-h3-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h3-fontWeight);
            font-style: var(--fontStyle-h3-fontStyle);
            text-transform: var(--textTransform-h3-textTransform);
          }

          .yip-patient-resources-root h4 {
            font-family: var(--fontFamily-h4-fontFamily);
            font-size: var(--fontSize-h4-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h4-fontWeight);
            font-style: var(--fontStyle-h4-fontStyle);
            text-transform: var(--textTransform-h4-textTransform);
          }

          .yip-patient-resources-root h5 {
            font-family: var(--fontFamily-h5-fontFamily);
            font-size: var(--fontSize-h5-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h5-fontWeight);
            font-style: var(--fontStyle-h5-fontStyle);
            text-transform: var(--textTransform-h5-textTransform);
          }

          .yip-patient-resources-root h6 {
            font-family: var(--fontFamily-h6-fontFamily);
            font-size: var(--fontSize-h6-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h6-fontWeight);
            font-style: var(--fontStyle-h6-fontStyle);
            text-transform: var(--textTransform-h6-textTransform);
          }

          .yip-patient-resources-root a.yip-patient-resources-text-link,
          .yip-patient-resources-root .yip-patient-resources-rich-text a {
            font-family: var(--fontFamily-link-fontFamily);
            font-size: var(--fontSize-link-fontSize);
            font-weight: var(--fontWeight-link-fontWeight);
            font-style: var(--fontStyle-link-fontStyle);
            line-height: 1.5;
            text-decoration: underline;
            text-transform: var(--textTransform-link-textTransform);
            letter-spacing: var(--letterSpacing-link-letterSpacing);
          }

          .yip-resources-media img {
            display: block;
            height: 100%;
            object-fit: cover;
            inset: 0;
            position: absolute;
            width: 100%;
          }

          .yip-resources-media {
            max-width: 100%;
            min-height: 500px;
            min-width: 0;
            overflow: hidden;
            position: relative;
            width: 100%;
          }

          .yip-resources-media-fill {
            inset: 0;
            position: absolute;
          }

          @media (max-width: 64rem) {
            .yip-resources-panel {
              grid-template-columns: 1fr !important;
              min-height: 18rem !important;
            }

            .yip-resources-media {
              min-height: 18rem !important;
            }
          }

          @media (max-width: 48rem) {
            .yip-resources-content {
              padding: 1.25rem !important;
            }

            .yip-resources-panel {
              min-height: 15rem !important;
            }

            .yip-resources-media {
              min-height: 15rem !important;
            }

            .yip-resources-tags {
              display: grid !important;
            }
          }
        `}</style>
        <Background
          as="section"
          background={props.section.backgroundColor}
          id="resources"
          className="yip-patient-resources-root px-4 py-pageSection-verticalPadding"
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
              className="yip-resources-panel"
              style={{
                ...getSurfaceColorStyle(
                  props.panelBackgroundColor,
                  streamDocument,
                ),
                borderRadius: "16px",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.5fr) minmax(18rem, 0.8fr)",
                minHeight: "500px",
                overflow: "hidden",
              }}
            >
              {imageSource ? (
                <div className="yip-resources-media">
                  <div className="yip-resources-media-fill">
                    <EntityField
                      displayName="Image"
                      fieldId={props.image.image.field}
                      constantValueEnabled={props.image.image.constantValueEnabled}
                    >
                      <img
                        alt={imageAlt}
                        loading="lazy"
                        src={imageSource}
                      />
                    </EntityField>
                  </div>
                </div>
              ) : null}
              <div
                className="yip-resources-content"
                style={{
                  color: panelForeground,
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  padding: "40px",
                }}
              >
                <EntityField
                  displayName="Heading"
                  fieldId={props.heading.text.field}
                  constantValueEnabled={props.heading.text.constantValueEnabled}
                >
                  <h2
                    style={{
                      color: props.heading.fontColor
                        ? getThemeColorCssValue(props.heading.fontColor)
                        : panelForeground,
                      fontFamily:
                        props.heading.styles.fontFamily === "default"
                          ? undefined
                          : props.heading.styles.fontFamily,
                      fontSize:
                        props.heading.styles.fontSize === "default"
                          ? "clamp(1.8rem, 4vw, 2.6rem)"
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
                      lineHeight: 1.2,
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
                <EntityField
                  displayName="Body"
                  fieldId={props.body.text.field}
                  constantValueEnabled={props.body.text.constantValueEnabled}
                >
                  <div
                    className="yip-patient-resources-rich-text"
                    style={{
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {renderRichText(body, bodyStyleOverrides)}
                  </div>
                </EntityField>
                <div
                  className="yip-resources-tags"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  {(props.items ?? []).map((item, index) => {
                    const ctaVariant = item.cta.styles?.variant;
                    const ctaColor = item.cta.styles?.color;
                    const renderedCta =
                      (ctaVariant === "secondary" || ctaVariant === "link") &&
                      (!ctaColor || ctaColor.selectedColor === "default") &&
                      panelCtaForegroundColor
                        ? {
                            ...item.cta,
                            styles: {
                              ...item.cta.styles,
                              color: panelCtaForegroundColor,
                            },
                          }
                        : item.cta;

                    return (
                      <div key={index}>
                        <EntityField
                          displayName="Resource Call to Action"
                          fieldId={item.cta.data?.cta?.field}
                          constantValueEnabled={
                            item.cta.data?.cta?.constantValueEnabled
                          }
                        >
                          <ComprehensiveCTA
                            value={renderedCta as Partial<ComprehensiveCTAValue>}
                            eventName={`resourceLink-${index}`}
                          />
                        </EntityField>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Background>
      </VisibilityWrapper>
    );
  };

export const IndividualPracticePatientResourcesSection: YextComponentConfig<IndividualPracticePatientResourcesSectionProps> =
  {
    label: "Patient Resources Section",
    fields: IndividualPracticePatientResourcesSectionFields,
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      panelBackgroundColor: primaryBackground,
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Patient Resources",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "View these resources before your appointment to streamline your visit.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      image: createImageField(),
      items: [
        { cta: createChipCta("Online Registration Forms") },
        { cta: createChipCta("Comprehensive Insurance List") },
        { cta: createChipCta("Financial Assistance Policy") },
        { cta: createChipCta("Telehealth Sign-In") },
      ],
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticePatientResourcesSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticePatientResourcesSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticePatientResourcesSection",
  displayName: "Patient Resources Section",
  description: "Patient Resources Section",
  pageSetTypes: ["ENTITY"],
};
