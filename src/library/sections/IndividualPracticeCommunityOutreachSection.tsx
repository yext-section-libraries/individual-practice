import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";
import {
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  getDefaultForegroundColor,
  getDefaultRTF,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  Image,
  MaybeRTF,
  resolveComponentData,
  type StyledImageValue,
  type StyledTextValue,
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

type OutreachImage = {
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

type IndividualPracticeCommunityOutreachSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  body: StyledRtfProps;
  image: OutreachImage;
  cta: Partial<ComprehensiveCTAValue>;
};

const whiteBackground: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const primaryTextColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const bodyTextColor: ThemeColor = {
  selectedColor: "#260e01",
  contrastingColor: "white",
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

const createImageField = (): OutreachImage => ({
  image: {
    field: "",
    constantValueEnabled: true,
    constantValue: {
      url: "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
      width: 1900,
      height: 1267,
    },
  },
  aspectRatio: 1.5,
  imageConstrain: "filled",
  styles: defaultImageStyles,
});

const createOutlineCta = (): Partial<ComprehensiveCTAValue> => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValueEnabled: true,
      constantValue: {
        ctaType: "textAndLink",
        label: { defaultValue: "View Community Calendar" },
        link: { defaultValue: "#" },
        linkType: "URL",
      },
      selectedType: "textAndLink",
    },
    openInNewTab: false,
    buttonText: { defaultValue: "View Community Calendar" },
    customId: "",
    customClass: "",
    dataAttributes: [],
    ariaLabel: { defaultValue: "View Community Calendar" },
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

const IndividualPracticeCommunityOutreachSectionFields: YextFields<IndividualPracticeCommunityOutreachSectionProps> =
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
    image: {
      label: "Image",
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
    cta: {
      label: "Call to Action",
      type: "comprehensiveCTA",
    },
  };

const IndividualPracticeCommunityOutreachSectionComponent: PuckComponent<IndividualPracticeCommunityOutreachSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const sectionCtaForegroundColor = getDefaultForegroundColor(
      props.section.backgroundColor,
      streamDocument,
    );
    const sectionForeground = props.section.backgroundColor.contrastingColor;
    const ctaVariant = props.cta.styles?.variant;
    const ctaColor = props.cta.styles?.color;
    const renderedCta =
      (ctaVariant === "secondary" || ctaVariant === "link") &&
      (!ctaColor || ctaColor.selectedColor === "default") &&
      sectionCtaForegroundColor
        ? {
            ...props.cta,
            styles: {
              ...props.cta.styles,
              color: sectionCtaForegroundColor,
            },
          }
        : props.cta;
    const heading =
      resolveComponentData(
        props.heading.text,
        locale,
        streamDocument,
      )?.toString() ?? "";
    const bodyStyleOverrides = {
      color: props.body.fontColor
        ? getThemeColorCssValue(props.body.fontColor)
        : sectionForeground,
    };
    const body = resolveComponentData(props.body.text, locale, streamDocument, {
      richTextStyleOverrides: bodyStyleOverrides,
    });
    const image = resolveComponentData(
      props.image.image,
      locale,
      streamDocument,
    ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
    const imageBorderRadius =
      props.image.styles?.borderRadius === "default"
        ? undefined
        : props.image.styles?.borderRadius;
    const imageWrapperStyle: React.CSSProperties = {
      aspectRatio:
        props.image.aspectRatio > 0 ? props.image.aspectRatio : undefined,
      borderRadius: imageBorderRadius,
      margin: "32px auto 0",
      maxWidth: "50.625rem",
      minWidth: 0,
      overflow:
        props.image.imageConstrain === "filled" || Boolean(imageBorderRadius)
          ? "hidden"
          : undefined,
      width: "100%",
    };

    return (
      <VisibilityWrapper
        isEditing={props.puck.isEditing}
        liveVisibility={props.section.visibleOnLivePage}
      >
        <style>{`
          .yip-outreach-rich-text p {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: clamp(1.2rem, 2vw, 1.7rem);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-outreach-rich-text li {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: clamp(1.2rem, 2vw, 1.7rem);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-outreach-root h1 {
            font-family: var(--fontFamily-h1-fontFamily);
            font-size: var(--fontSize-h1-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h1-fontWeight);
            font-style: var(--fontStyle-h1-fontStyle);
            text-transform: var(--textTransform-h1-textTransform);
          }

          .yip-outreach-root h2 {
            font-family: var(--fontFamily-h2-fontFamily);
            font-size: var(--fontSize-h2-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h2-fontWeight);
            font-style: var(--fontStyle-h2-fontStyle);
            text-transform: var(--textTransform-h2-textTransform);
          }

          .yip-outreach-root h3 {
            font-family: var(--fontFamily-h3-fontFamily);
            font-size: var(--fontSize-h3-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h3-fontWeight);
            font-style: var(--fontStyle-h3-fontStyle);
            text-transform: var(--textTransform-h3-textTransform);
          }

          .yip-outreach-root h4 {
            font-family: var(--fontFamily-h4-fontFamily);
            font-size: var(--fontSize-h4-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h4-fontWeight);
            font-style: var(--fontStyle-h4-fontStyle);
            text-transform: var(--textTransform-h4-textTransform);
          }

          .yip-outreach-root h5 {
            font-family: var(--fontFamily-h5-fontFamily);
            font-size: var(--fontSize-h5-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h5-fontWeight);
            font-style: var(--fontStyle-h5-fontStyle);
            text-transform: var(--textTransform-h5-textTransform);
          }

          .yip-outreach-root h6 {
            font-family: var(--fontFamily-h6-fontFamily);
            font-size: var(--fontSize-h6-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h6-fontWeight);
            font-style: var(--fontStyle-h6-fontStyle);
            text-transform: var(--textTransform-h6-textTransform);
          }

          .yip-outreach-root a.yip-outreach-text-link,
          .yip-outreach-root .yip-outreach-rich-text a {
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
            .yip-outreach-cta {
              width: 100%;
            }

            .yip-outreach-cta > * {
              width: 100%;
            }
          }
        `}</style>
        <section
          className="yip-outreach-root px-4 py-pageSection-verticalPadding"
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
            <div style={{ textAlign: "center" }}>
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  style={{
                    color: props.heading.fontColor
                      ? getThemeColorCssValue(props.heading.fontColor)
                      : sectionForeground,
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
              <EntityField
                displayName="Body"
                fieldId={props.body.text.field}
                constantValueEnabled={props.body.text.constantValueEnabled}
              >
                <div
                  className="yip-outreach-rich-text"
                  style={{
                    lineHeight: 1.45,
                    margin: "16px auto 0",
                    maxWidth: "49rem",
                  }}
                >
                  {React.isValidElement(body) ? (
                    body
                  ) : (
                    <MaybeRTF
                      data={typeof body === "string" ? body : ""}
                      richTextStyleOverrides={bodyStyleOverrides}
                    />
                  )}
                </div>
              </EntityField>
            </div>
            {image ? (
              <EntityField
                displayName="Image"
                fieldId={props.image.image.field}
                constantValueEnabled={props.image.image.constantValueEnabled}
              >
                <div
                  style={{
                    ...imageWrapperStyle,
                  }}
                >
                  <Image
                    image={image}
                    className={props.image.aspectRatio > 0 ? "h-full" : undefined}
                    style={{
                      display: "block",
                      height: props.image.aspectRatio > 0 ? "100%" : "auto",
                      objectFit:
                        props.image.imageConstrain === "filled"
                          ? "cover"
                          : "contain",
                      width: "100%",
                    }}
                  />
                </div>
              </EntityField>
            ) : null}
            <div
              className="yip-outreach-cta"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "32px",
              }}
            >
              <EntityField
                displayName="Call to Action"
                fieldId={props.cta.data?.cta?.field}
                constantValueEnabled={props.cta.data?.cta?.constantValueEnabled}
              >
                <ComprehensiveCTA
                  value={renderedCta as Partial<ComprehensiveCTAValue>}
                  eventName="primaryCta"
                />
              </EntityField>
            </div>
          </div>
        </section>
      </VisibilityWrapper>
    );
  };

export const IndividualPracticeCommunityOutreachSection: YextComponentConfig<IndividualPracticeCommunityOutreachSectionProps> =
  {
    label: "Community Outreach Section",
    fields: IndividualPracticeCommunityOutreachSectionFields,
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "🌿 Community Outreach",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: primaryTextColor,
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "[[name]] is more than a clinic; we are a community partner. We provide medical support for [[address.city]] high school athletics and host monthly “Walk with a Doc” sessions at local parks to encourage heart health.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: bodyTextColor,
      },
      image: createImageField(),
      cta: createOutlineCta(),
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeCommunityOutreachSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeCommunityOutreachSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeCommunityOutreachSection",
  displayName: "Community Outreach Section",
  description: "Community Outreach Section",
  pageSetTypes: ["ENTITY"],
};
