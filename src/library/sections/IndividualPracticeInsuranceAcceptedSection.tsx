import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  createItemSource,
  EntityField,
  getDefaultRTF,
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
  type YextComponentConfig,
  type YextEntityField,
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

type StyledTextListProps = {
  text: YextEntityField<TranslatableString[]>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type InsuranceGroupFields = {
  title: YextEntityField<TranslatableString>;
  items: YextEntityField<TranslatableString[]>;
  backgroundColor: ThemeColor;
};

type InsuranceGroupStyles = {
  title: Omit<StyledTextProps, "text">;
  items: Omit<StyledTextListProps, "text">;
};

type IndividualPracticeInsuranceAcceptedSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  subtitle: StyledRtfProps;
  groups: typeof insuranceGroupsSource.value;
  groupStyles: InsuranceGroupStyles;
};

const whiteBackground: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const featuredBackground: ThemeColor = {
  selectedColor: "palette-quaternary-light",
  contrastingColor: "black",
};

const primaryColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const bodyTextColor: ThemeColor = {
  selectedColor: "#6f594c",
  contrastingColor: "white",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const createTextField = (
  defaultValue: string,
  fontColor?: ThemeColor,
): StyledTextProps => ({
  text: {
    field: "",
    constantValue: {
      defaultValue,
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  styles: defaultTextStyles,
  fontColor,
});

const createRtfField = (
  defaultValue: string,
  fontColor?: ThemeColor,
): StyledRtfProps => ({
  text: {
    field: "",
    constantValue: {
      defaultValue: getDefaultRTF(defaultValue),
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  fontColor,
});

const createTextListField = (
  defaultValue: string[],
  fontColor?: ThemeColor,
): StyledTextListProps => ({
  text: {
    field: "",
    constantValue: defaultValue,
    constantValueEnabled: true,
  },
  styles: defaultTextStyles,
  fontColor,
});

const insuranceGroupsSource = createItemSource<InsuranceGroupFields>({
  label: "Insurance Groups",
  mappingFields: {
    title: {
      type: "entityField",
      label: "Title",
      filter: { types: ["type.string"] },
    },
    items: {
      type: "entityField",
      label: "Items",
      filter: { types: ["type.string"], includeListsOnly: true },
    },
    backgroundColor: {
      label: "Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
  },
  defaultValues: [
    {
      title: createTextField("Government Programs").text,
      items: createTextListField([
        "Medicare Part B",
        "MassHealth (as plated)",
        "Tricare Prime & Select",
      ]).text,
      backgroundColor: whiteBackground,
    },
    {
      title: createTextField("Private / Commercial Insurance").text,
      items: createTextListField([
        "Blue Cross Blue Shield (PPO, HMO)",
        "Aetna Choice POS II, Select, Open Access",
        "Cigna Open Access Plus, PPO",
        "UnitedHealthcare Choice, Choice Plus, PPO",
        "Harvard Pilgrim HMO, POS, Flex",
        "Tufts Health Plan Commercial & Public",
        "Humana",
      ]).text,
      backgroundColor: featuredBackground,
    },
    {
      title: createTextField("Other").text,
      items: createTextListField([
        "Workers' Compensation",
        "Motor Vehicle Accident (MVA) Insurance",
        "HSA/FSA cards at point of service",
      ]).text,
      backgroundColor: whiteBackground,
    },
  ],
});

const IndividualPracticeInsuranceAcceptedSectionFields: YextFields<IndividualPracticeInsuranceAcceptedSectionProps> =
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
    subtitle: {
      label: "Subtitle",
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
    groups: insuranceGroupsSource.field,
    groupStyles: {
      label: "Insurance Group Styles",
      type: "object",
      objectFields: {
        title: {
          label: "Title",
          type: "object",
          objectFields: {
            styles: { label: "Text Styles", type: "styledText" },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        items: {
          label: "Items",
          type: "object",
          objectFields: {
            styles: { label: "Text Styles", type: "styledText" },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

const IndividualPracticeInsuranceAcceptedSectionComponent: PuckComponent<
  IndividualPracticeInsuranceAcceptedSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const heading =
    resolveComponentData(
      props.heading.text,
      locale,
      streamDocument,
    )?.toString() ?? "";
  const sectionForeground = getThemeColorCssValue(
    props.section.backgroundColor.contrastingColor,
  );
  const subtitleStyleOverrides = {
    color: props.subtitle.fontColor
      ? getThemeColorCssValue(props.subtitle.fontColor)
      : sectionForeground,
  };
  const subtitle = resolveComponentData(
    props.subtitle.text,
    locale,
    streamDocument,
    {
      richTextStyleOverrides: subtitleStyleOverrides,
    },
  );
  const groups = insuranceGroupsSource.resolveItems(
    props.groups,
    streamDocument,
  );

  return (
    <VisibilityWrapper
      isEditing={props.puck.isEditing}
      liveVisibility={props.section.visibleOnLivePage}
    >
      <style>{`
          .yip-insurance-root p {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-insurance-root li {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-insurance-root h1 {
            font-family: var(--fontFamily-h1-fontFamily);
            font-size: var(--fontSize-h1-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h1-fontWeight);
            font-style: var(--fontStyle-h1-fontStyle);
            text-transform: var(--textTransform-h1-textTransform);
          }

          .yip-insurance-root h2 {
            font-family: var(--fontFamily-h2-fontFamily);
            font-size: var(--fontSize-h2-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h2-fontWeight);
            font-style: var(--fontStyle-h2-fontStyle);
            text-transform: var(--textTransform-h2-textTransform);
          }

          .yip-insurance-root h3 {
            font-family: var(--fontFamily-h3-fontFamily);
            font-size: var(--fontSize-h3-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h3-fontWeight);
            font-style: var(--fontStyle-h3-fontStyle);
            text-transform: var(--textTransform-h3-textTransform);
          }

          .yip-insurance-root h4 {
            font-family: var(--fontFamily-h4-fontFamily);
            font-size: var(--fontSize-h4-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h4-fontWeight);
            font-style: var(--fontStyle-h4-fontStyle);
            text-transform: var(--textTransform-h4-textTransform);
          }

          .yip-insurance-root h5 {
            font-family: var(--fontFamily-h5-fontFamily);
            font-size: var(--fontSize-h5-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h5-fontWeight);
            font-style: var(--fontStyle-h5-fontStyle);
            text-transform: var(--textTransform-h5-textTransform);
          }

          .yip-insurance-root h6 {
            font-family: var(--fontFamily-h6-fontFamily);
            font-size: var(--fontSize-h6-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h6-fontWeight);
            font-style: var(--fontStyle-h6-fontStyle);
            text-transform: var(--textTransform-h6-textTransform);
          }

          .yip-insurance-root a.yip-insurance-text-link,
          .yip-insurance-root .yip-insurance-rich-text a {
            font-family: var(--fontFamily-link-fontFamily);
            font-size: var(--fontSize-link-fontSize);
            font-weight: var(--fontWeight-link-fontWeight);
            font-style: var(--fontStyle-link-fontStyle);
            line-height: 1.5;
            text-decoration: underline;
            text-transform: var(--textTransform-link-textTransform);
            letter-spacing: var(--letterSpacing-link-letterSpacing);
          }
        `}</style>
      <section
        id="insurance"
        className="yip-insurance-root px-4 py-pageSection-verticalPadding"
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
            style={{
              marginBottom: "32px",
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
            <EntityField
              displayName="Subtitle"
              fieldId={props.subtitle.text.field}
              constantValueEnabled={props.subtitle.text.constantValueEnabled}
            >
              <div
                className="yip-insurance-rich-text"
                style={{
                  margin: "12px auto 0",
                  maxWidth: "42rem",
                }}
              >
                {React.isValidElement(subtitle) ? (
                  subtitle
                ) : (
                  <MaybeRTF
                    data={typeof subtitle === "string" ? subtitle : ""}
                    richTextStyleOverrides={subtitleStyleOverrides}
                  />
                )}
              </div>
            </EntityField>
          </div>
          <EntityField
            displayName="Insurance Groups"
            fieldId={props.groups.field}
            constantValueEnabled={props.groups.constantValueEnabled}
          >
            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {groups.map((group, index) => {
                const title = resolveComponentData(
                  group.title,
                  locale,
                  streamDocument,
                  { output: "plainText" },
                );
                const items = (group.items ?? []).map((item) =>
                  resolveComponentData(item, locale, streamDocument, {
                    output: "plainText",
                  }),
                );
                const groupForeground = getThemeColorCssValue(
                  group.backgroundColor.contrastingColor,
                );
                const itemTextStyle: React.CSSProperties = {
                  color: getThemeColorCssValue(
                    props.groupStyles.items.fontColor ??
                      group.backgroundColor.contrastingColor,
                  ),
                  fontFamily:
                    props.groupStyles.items.styles.fontFamily === "default"
                      ? undefined
                      : props.groupStyles.items.styles.fontFamily,
                  fontSize:
                    props.groupStyles.items.styles.fontSize === "default"
                      ? undefined
                      : props.groupStyles.items.styles.fontSize,
                  fontStyle:
                    props.groupStyles.items.styles.fontStyle === "default"
                      ? undefined
                      : props.groupStyles.items.styles.fontStyle,
                  fontWeight:
                    props.groupStyles.items.styles.fontWeight === "default"
                      ? undefined
                      : props.groupStyles.items.styles.fontWeight,
                  textTransform:
                    props.groupStyles.items.styles.textTransform === "default"
                      ? undefined
                      : props.groupStyles.items.styles.textTransform,
                };

                return (
                  <article
                    key={`${title}-${index}`}
                    style={{
                      backgroundColor: getThemeColorCssValue(
                        group.backgroundColor,
                      ),
                      border: `1px solid color-mix(in srgb, ${groupForeground} 4%, transparent)`,
                      borderRadius: "20px",
                      minHeight: "100%",
                      padding: "20px",
                    }}
                  >
                    <h3
                      style={{
                        color: getThemeColorCssValue(
                          props.groupStyles.title.fontColor ??
                            group.backgroundColor.contrastingColor,
                        ),
                        fontFamily:
                          props.groupStyles.title.styles.fontFamily ===
                          "default"
                            ? undefined
                            : props.groupStyles.title.styles.fontFamily,
                        fontSize:
                          props.groupStyles.title.styles.fontSize === "default"
                            ? "1.05rem"
                            : props.groupStyles.title.styles.fontSize,
                        fontStyle:
                          props.groupStyles.title.styles.fontStyle === "default"
                            ? undefined
                            : props.groupStyles.title.styles.fontStyle,
                        fontWeight:
                          props.groupStyles.title.styles.fontWeight ===
                          "default"
                            ? undefined
                            : props.groupStyles.title.styles.fontWeight,
                        margin: "0 0 16px",
                        textAlign: "center",
                        textTransform:
                          props.groupStyles.title.styles.textTransform ===
                          "default"
                            ? undefined
                            : props.groupStyles.title.styles.textTransform,
                      }}
                    >
                      {title}
                    </h3>
                    <ul
                      style={{
                        display: "grid",
                        gap: "12px",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {items.map((item) => (
                        <li key={item} style={itemTextStyle}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </EntityField>
        </div>
      </section>
    </VisibilityWrapper>
  );
};

export const IndividualPracticeInsuranceAcceptedSection: YextComponentConfig<IndividualPracticeInsuranceAcceptedSectionProps> =
  {
    label: "Insurance Accepted Section",
    fields: IndividualPracticeInsuranceAcceptedSectionFields,
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      heading: createTextField("Insurance Accepted", primaryColor),
      subtitle: createRtfField(
        "[[name]] is proud to be an in-network provider for a wide range of insurance carriers, as well as the following plans.",
        bodyTextColor,
      ),
      groups: insuranceGroupsSource.defaultValue,
      groupStyles: {
        title: { styles: defaultTextStyles, fontColor: primaryColor },
        items: { styles: defaultTextStyles, fontColor: bodyTextColor },
      },
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeInsuranceAcceptedSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeInsuranceAcceptedSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeInsuranceAcceptedSection",
  displayName: "Insurance Accepted Section",
  description: "Insurance Accepted Section",
  pageSetTypes: ["ENTITY"],
};
