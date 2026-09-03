import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { AnalyticsScopeProvider, useAnalytics } from "@yext/pages-components";
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
  type YextEntityField,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type FontColorProps = {
  fontColor?: ThemeColor;
};

type FaqTextStyles = FontColorProps & {
  styles: StyledTextValue;
};

type FaqItemFields = {
  question: YextEntityField<TranslatableString>;
  answer: YextEntityField<TranslatableRichText>;
};

type IndividualPracticeFaqSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  closedBackgroundColor: ThemeColor;
  openBackgroundColor: ThemeColor;
  heading: StyledTextProps;
  questionStyles: FaqTextStyles;
  answerStyles: FontColorProps;
  items: typeof faqItemsSource.value;
};

const whiteBackground: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const closedBackground: ThemeColor = {
  selectedColor: "palette-quaternary-light",
  contrastingColor: "black",
};

const openBackground: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const faqItemsSource = createItemSource<FaqItemFields>({
  label: "FAQs",
  mappingFields: {
    question: {
      type: "entityField",
      label: "Question",
      filter: { types: ["type.string"] },
    },
    answer: {
      type: "entityField",
      label: "Answer",
      filter: { types: ["type.rich_text_v2"] },
    },
  },
  defaultValues: [
    {
      question: {
        field: "",
        constantValue: {
          defaultValue: "When should I go to Urgent Care vs. the ER?",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Urgent care is for conditions that need immediate attention but are not life-threatening, such as sprains, sore throats, or minor cuts. For chest pain, difficulty breathing, or severe trauma, please call 911 or go to the nearest ER.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue: "Is there a separate entrance for Urgent Care?",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "No, all patients enter through the main lobby. Urgent Care patients are triaged immediately upon arrival to ensure those with acute needs are seen quickly.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue: "Do I need an appointment for Urgent Care?",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "No, walk-ins are always welcome. However, you can use our “Save My Spot” online check-in to reduce your wait time in the clinic.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue: "Can I pay my bill online?",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Yes. Our secure bill-pay portal is available through the [[name]] website and the Patient Portal.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue: "How long does it take to get lab results?",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Most routine blood work and rapid tests (Flu, Strep, COVID-19) are processed on-site. Results are typically uploaded to the Patient Portal within 4 to 24 hours.",
          ),
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
    },
  ],
});

const IndividualPracticeFaqSectionFields: YextFields<IndividualPracticeFaqSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    closedBackgroundColor: {
      label: "Closed Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    openBackgroundColor: {
      label: "Open Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
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
    questionStyles: {
      label: "Question Text Styles",
      type: "object",
      objectFields: {
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
    answerStyles: {
      label: "Answer Text Styles",
      type: "object",
      objectFields: {
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    items: faqItemsSource.field,
  };

const resolveText = (
  value: YextEntityField<TranslatableString>,
  locale: string,
  streamDocument: Record<string, unknown>,
): string => {
  return resolveComponentData(value, locale, streamDocument)?.toString() ?? "";
};

const IndividualPracticeFaqSectionComponent: React.FC<
  IndividualPracticeFaqSectionProps & { puck: { isEditing: boolean } }
> = (props) => {
  const analytics = useAnalytics();
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const heading = resolveText(props.heading.text, locale, streamDocument);
  const items = faqItemsSource.resolveItems(props.items, streamDocument);
  const [openItems, setOpenItems] = React.useState<number[]>([]);
  const sectionForeground = getThemeColorCssValue(
    props.section.backgroundColor.contrastingColor,
  );

  const isOpen = (index: number) => openItems.includes(index);

  const toggleItem = (index: number) => {
    const nextOpen = !isOpen(index);
    setOpenItems((current) =>
      nextOpen
        ? [...current, index]
        : current.filter((value) => value !== index),
    );
    analytics?.track({
      action: nextOpen ? "EXPAND" : "COLLAPSE",
      eventName: `toggle${index}`,
    });
  };

  return (
    <VisibilityWrapper
      isEditing={props.puck.isEditing}
      liveVisibility={props.section.visibleOnLivePage}
    >
      <style>{`
        .yip-faq-root p {
          font-family: var(--fontFamily-body-fontFamily);
          font-size: var(--fontSize-body-fontSize);
          line-height: 1.5;
          font-weight: var(--fontWeight-body-fontWeight);
          font-style: var(--fontStyle-body-fontStyle);
          text-transform: var(--textTransform-body-textTransform);
        }

        .yip-faq-root li {
          font-family: var(--fontFamily-body-fontFamily);
          font-size: var(--fontSize-body-fontSize);
          line-height: 1.5;
          font-weight: var(--fontWeight-body-fontWeight);
          font-style: var(--fontStyle-body-fontStyle);
          text-transform: var(--textTransform-body-textTransform);
        }

        .yip-faq-root h1 {
          font-family: var(--fontFamily-h1-fontFamily);
          font-size: var(--fontSize-h1-fontSize);
          line-height: 1.2;
          font-weight: var(--fontWeight-h1-fontWeight);
          font-style: var(--fontStyle-h1-fontStyle);
          text-transform: var(--textTransform-h1-textTransform);
        }

        .yip-faq-root h2 {
          font-family: var(--fontFamily-h2-fontFamily);
          font-size: var(--fontSize-h2-fontSize);
          line-height: 1.2;
          font-weight: var(--fontWeight-h2-fontWeight);
          font-style: var(--fontStyle-h2-fontStyle);
          text-transform: var(--textTransform-h2-textTransform);
        }

        .yip-faq-root h3 {
          font-family: var(--fontFamily-h3-fontFamily);
          font-size: var(--fontSize-h3-fontSize);
          line-height: 1.2;
          font-weight: var(--fontWeight-h3-fontWeight);
          font-style: var(--fontStyle-h3-fontStyle);
          text-transform: var(--textTransform-h3-textTransform);
        }

        .yip-faq-root h4 {
          font-family: var(--fontFamily-h4-fontFamily);
          font-size: var(--fontSize-h4-fontSize);
          line-height: 1.2;
          font-weight: var(--fontWeight-h4-fontWeight);
          font-style: var(--fontStyle-h4-fontStyle);
          text-transform: var(--textTransform-h4-textTransform);
        }

        .yip-faq-root h5 {
          font-family: var(--fontFamily-h5-fontFamily);
          font-size: var(--fontSize-h5-fontSize);
          line-height: 1.2;
          font-weight: var(--fontWeight-h5-fontWeight);
          font-style: var(--fontStyle-h5-fontStyle);
          text-transform: var(--textTransform-h5-textTransform);
        }

        .yip-faq-root h6 {
          font-family: var(--fontFamily-h6-fontFamily);
          font-size: var(--fontSize-h6-fontSize);
          line-height: 1.2;
          font-weight: var(--fontWeight-h6-fontWeight);
          font-style: var(--fontStyle-h6-fontStyle);
          text-transform: var(--textTransform-h6-textTransform);
        }

        .yip-faq-root a.yip-faq-text-link,
        .yip-faq-root .yip-faq-rich-text a {
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
          .yip-faq-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <section
        className="yip-faq-root px-4 py-pageSection-verticalPadding"
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
            displayName="FAQs"
            fieldId={props.items.field}
            constantValueEnabled={props.items.constantValueEnabled}
          >
            <div
              className="yip-faq-grid"
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              }}
            >
              {items.map((item, index) => {
                const open = isOpen(index);
                const currentBackground = open
                  ? props.openBackgroundColor
                  : props.closedBackgroundColor;
                const currentForeground = getThemeColorCssValue(
                  currentBackground.contrastingColor,
                );
                const resolvedQuestion = resolveComponentData(
                  item.question,
                  locale,
                  streamDocument,
                  { output: "plainText" },
                );
                const answerStyleOverrides = {
                  color: props.answerStyles.fontColor
                    ? getThemeColorCssValue(props.answerStyles.fontColor)
                    : currentForeground,
                };
                const resolvedAnswer = item.answer
                  ? resolveComponentData(item.answer, locale, streamDocument, {
                      richTextStyleOverrides: answerStyleOverrides,
                    })
                  : undefined;

                return (
                  <article
                    key={index}
                    style={{
                      backgroundColor: getThemeColorCssValue(currentBackground),
                      border: `1px solid color-mix(in srgb, ${sectionForeground} 6%, transparent)`,
                      borderRadius: "24px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      style={{
                        alignItems: "flex-start",
                        background: "transparent",
                        border: 0,
                        color: currentForeground,
                        cursor: "pointer",
                        display: "flex",
                        gap: "16px",
                        justifyContent: "space-between",
                        padding: "24px 28px",
                        textAlign: "left",
                        width: "100%",
                      }}
                      type="button"
                    >
                      <span
                        style={{
                          color: props.questionStyles.fontColor
                            ? getThemeColorCssValue(
                                props.questionStyles.fontColor,
                              )
                            : currentForeground,
                          flex: 1,
                          fontFamily:
                            props.questionStyles.styles.fontFamily === "default"
                              ? undefined
                              : props.questionStyles.styles.fontFamily,
                          fontSize:
                            props.questionStyles.styles.fontSize === "default"
                              ? "clamp(1.15rem, 1.8vw, 1.35rem)"
                              : props.questionStyles.styles.fontSize,
                          fontStyle:
                            props.questionStyles.styles.fontStyle === "default"
                              ? undefined
                              : props.questionStyles.styles.fontStyle,
                          fontWeight:
                            props.questionStyles.styles.fontWeight === "default"
                              ? 500
                              : props.questionStyles.styles.fontWeight,
                          lineHeight: 1.3,
                          textTransform:
                            props.questionStyles.styles.textTransform ===
                            "default"
                              ? undefined
                              : props.questionStyles.styles.textTransform,
                        }}
                      >
                        {resolvedQuestion}
                      </span>
                      <span
                        aria-hidden
                        style={{
                          display: "inline-flex",
                          fontSize: "1.5rem",
                          lineHeight: 1,
                        }}
                      >
                        {open ? "−" : "+"}
                      </span>
                    </button>
                    {open ? (
                      <div
                        className="yip-faq-rich-text"
                        style={{
                          padding: "0 28px 24px",
                        }}
                      >
                        {React.isValidElement(resolvedAnswer) ? (
                          resolvedAnswer
                        ) : (
                          <MaybeRTF
                            data={
                              typeof resolvedAnswer === "string"
                                ? resolvedAnswer
                                : ""
                            }
                            richTextStyleOverrides={answerStyleOverrides}
                          />
                        )}
                      </div>
                    ) : null}
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

export const IndividualPracticeFaqSection: YextComponentConfig<IndividualPracticeFaqSectionProps> =
  {
    label: "FAQ Section",
    fields: IndividualPracticeFaqSectionFields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: whiteBackground,
      },
      closedBackgroundColor: closedBackground,
      openBackgroundColor: openBackground,
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Frequently asked questions",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      questionStyles: {
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      answerStyles: {
        fontColor: undefined,
      },
      items: faqItemsSource.defaultValue,
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeFaqSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeFaqSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeFaqSection",
  displayName: "FAQ Section",
  description: "FAQ Section",
  pageSetTypes: ["ENTITY"],
};
