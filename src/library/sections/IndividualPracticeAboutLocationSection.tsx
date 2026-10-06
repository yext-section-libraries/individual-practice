import "../shared/typography.css";
import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  msg,
  Background,
  EntityField,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
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
import {
  lightTextStyles as defaultTextStyles,
  getScopedTypographyStyles,
  getExplicitTextColorCssValue,
  renderRichText,
  sectionField,
  whiteBackground,
} from "../shared/sectionHelpers";

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

const aboutLocationBodyDefaultValue = {
  html:
    '<p dir="ltr"><span>[[name]] is [[address.city]]’s premier destination for integrated medical services. Located conveniently on Meridian Ave, we bridge the gap between a standard doctor’s office and a hospital emergency room.</span></p><p dir="ltr"><span>Our facility is designed for efficiency and patient comfort. By housing advanced imaging, a high-complexity lab, and a diverse team of specialists under one roof, we ensure that diagnosis and treatment happen in hours, not days. We are committed to reducing ER wait times and providing the [[address.city]] community with a higher standard of local healthcare.</span></p>',
  json: "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"[[name]] is [[address.city]]’s premier destination for integrated medical services. Located conveniently on Meridian Ave, we bridge the gap between a standard doctor’s office and a hospital emergency room.\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Our facility is designed for efficiency and patient comfort. By housing advanced imaging, a high-complexity lab, and a diverse team of specialists under one roof, we ensure that diagnosis and treatment happen in hours, not days. We are committed to reducing ER wait times and providing the [[address.city]] community with a higher standard of local healthcare.\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
};

const IndividualPracticeAboutLocationSectionFields: YextFields<IndividualPracticeAboutLocationSectionProps> =
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
        ? getExplicitTextColorCssValue(props.body.fontColor)
        : sectionForeground,
    };
    const body = resolveComponentData(props.body.text, locale, streamDocument);

    return (
      <VisibilityWrapper
        isEditing={props.puck.isEditing}
        liveVisibility={props.section.visibleOnLivePage}
      >
        <style>{`
          ${getScopedTypographyStyles("yip-about-root")}
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
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yip-about-root px-4 py-pageSection-verticalPadding"
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
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
              width: "min(100%, var(--maxWidth-pageSection-contentWidth))",
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
                      ? getExplicitTextColorCssValue(props.heading.fontColor)
                      : sectionForeground,
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
                {renderRichText(body, bodyStyleOverrides)}
              </div>
            </EntityField>
          </div>
        </Background>
      </VisibilityWrapper>
    );
  };

export const IndividualPracticeAboutLocationSection: YextComponentConfig<IndividualPracticeAboutLocationSectionProps> =
  {
    label: msg("components.aboutLocation", "About Location"),
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
  displayName: "About Location",
  description: "About Location",
  pageSetTypes: ["ENTITY"],
};
