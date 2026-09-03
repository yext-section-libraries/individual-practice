import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  EntityField,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  MaybeRTF,
  resolveComponentData,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextEntityField,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  fontColor?: ThemeColor;
};

type IndividualPracticeAboutLocationSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  body: StyledRtfProps;
};

const whiteBackground: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "100",
  fontStyle: "default",
  textTransform: "default",
};

const aboutLocationBodyDefaultValue = {
  html:
    '<p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>[[name]] is [[address.city]]’s premier destination for integrated medical services. Located conveniently on Meridian Ave, we bridge the gap between a standard doctor’s office and a hospital emergency room.</span></p><p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>Our facility is designed for efficiency and patient comfort. By housing advanced imaging, a high-complexity lab, and a diverse team of specialists under one roof, we ensure that diagnosis and treatment happen in hours, not days. We are committed to reducing ER wait times and providing the [[address.city]] community with a higher standard of local healthcare.</span></p>',
  json: "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"[[name]] is [[address.city]]’s premier destination for integrated medical services. Located conveniently on Meridian Ave, we bridge the gap between a standard doctor’s office and a hospital emergency room.\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Our facility is designed for efficiency and patient comfort. By housing advanced imaging, a high-complexity lab, and a diverse team of specialists under one roof, we ensure that diagnosis and treatment happen in hours, not days. We are committed to reducing ER wait times and providing the [[address.city]] community with a higher standard of local healthcare.\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
};

const IndividualPracticeAboutLocationSectionFields: YextFields<IndividualPracticeAboutLocationSectionProps> =
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
  };

const IndividualPracticeAboutLocationSectionComponent: PuckComponent<IndividualPracticeAboutLocationSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const heading =
      resolveComponentData(
        props.heading.text,
        locale,
        streamDocument,
      )?.toString() ??
      "";
    const sectionForeground = getThemeColorCssValue(
      props.section.backgroundColor.contrastingColor,
    );
    const bodyStyleOverrides = {
      color: props.body.fontColor
        ? getThemeColorCssValue(props.body.fontColor)
        : sectionForeground,
    };
    const body = resolveComponentData(
      props.body.text,
      locale,
      streamDocument,
      {
        richTextStyleOverrides: bodyStyleOverrides,
      },
    );

    return (
      <VisibilityWrapper
        isEditing={props.puck.isEditing}
        liveVisibility={props.section.visibleOnLivePage}
      >
        <style>{`
          .yip-about-root p {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-about-root li {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-about-root h1 {
            font-family: var(--fontFamily-h1-fontFamily);
            font-size: var(--fontSize-h1-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h1-fontWeight);
            font-style: var(--fontStyle-h1-fontStyle);
            text-transform: var(--textTransform-h1-textTransform);
          }

          .yip-about-root h2 {
            font-family: var(--fontFamily-h2-fontFamily);
            font-size: var(--fontSize-h2-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h2-fontWeight);
            font-style: var(--fontStyle-h2-fontStyle);
            text-transform: var(--textTransform-h2-textTransform);
          }

          .yip-about-root h3 {
            font-family: var(--fontFamily-h3-fontFamily);
            font-size: var(--fontSize-h3-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h3-fontWeight);
            font-style: var(--fontStyle-h3-fontStyle);
            text-transform: var(--textTransform-h3-textTransform);
          }

          .yip-about-root h4 {
            font-family: var(--fontFamily-h4-fontFamily);
            font-size: var(--fontSize-h4-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h4-fontWeight);
            font-style: var(--fontStyle-h4-fontStyle);
            text-transform: var(--textTransform-h4-textTransform);
          }

          .yip-about-root h5 {
            font-family: var(--fontFamily-h5-fontFamily);
            font-size: var(--fontSize-h5-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h5-fontWeight);
            font-style: var(--fontStyle-h5-fontStyle);
            text-transform: var(--textTransform-h5-textTransform);
          }

          .yip-about-root h6 {
            font-family: var(--fontFamily-h6-fontFamily);
            font-size: var(--fontSize-h6-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h6-fontWeight);
            font-style: var(--fontStyle-h6-fontStyle);
            text-transform: var(--textTransform-h6-textTransform);
          }

          .yip-about-root a.yip-about-text-link,
          .yip-about-root .yip-about-rich-text a {
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
            .yip-about-grid {
              gap: 1rem !important;
              grid-template-columns: 1fr !important;
              padding-inline: 0.85rem;
            }

            .yip-about-heading {
              text-align: center;
            }
          }
        `}</style>
        <section
          className="yip-about-root px-4 py-pageSection-verticalPadding"
          style={{
            backgroundColor: getThemeColorCssValue(props.section.backgroundColor),
          }}
        >
          <div
            className="yip-about-grid"
            style={{
              alignItems: "start",
              display: "grid",
              gap: "clamp(1.5rem, 4vw, 3rem)",
              gridTemplateColumns: "minmax(14rem, 18rem) minmax(0, 1fr)",
              margin: "0 auto",
              width: "min(100%, 73rem)",
            }}
          >
            <div className="yip-about-heading">
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
            </div>
            <EntityField
              displayName="Body"
              fieldId={props.body.text.field}
              constantValueEnabled={props.body.text.constantValueEnabled}
            >
              <div
                className="yip-about-rich-text"
                style={{
                  display: "grid",
                  gap: "16px",
                  lineHeight: 1.65,
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
        </section>
      </VisibilityWrapper>
    );
  };

export const IndividualPracticeAboutLocationSection: YextComponentConfig<IndividualPracticeAboutLocationSectionProps> =
  {
    label: "About Location Section",
    fields: IndividualPracticeAboutLocationSectionFields,
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "About this location",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: aboutLocationBodyDefaultValue,
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeAboutLocationSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeAboutLocationSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeAboutLocationSection",
  displayName: "About Location Section",
  description: "About Location Section",
  pageSetTypes: ["ENTITY"],
};
