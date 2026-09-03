import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { parsePhoneNumber } from "awesome-phonenumber";
import type { PuckComponent } from "@puckeditor/core";
import {
  Address,
  AnalyticsScopeProvider,
  HoursTable,
  Link,
  type AddressType,
  type HoursType,
} from "@yext/pages-components";
import {
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  getDefaultForegroundColor,
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

type PhoneItem = {
  number: YextEntityField<string>;
  label: string;
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

type SummaryHoursStyles = {
  startOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
    | "today";
  collapseDays: boolean;
  showAdditionalHoursText: boolean;
  alignment: "items-start" | "items-center" | "items-end";
};

type IndividualPracticeFacilitySummarySectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  contactHeading: StyledTextProps;
  address: YextEntityField<AddressType>;
  showRegion: boolean;
  showCountry: boolean;
  showTextLinkUnderline?: boolean;
  phones: {
    items: PhoneItem[];
    phoneFormat: "international" | "domestic";
    includeHyperlink?: boolean;
  };
  directionsLink: Partial<ComprehensiveCTAValue>;
  appointmentLink: Partial<ComprehensiveCTAValue>;
  accessibilityHeading: StyledTextProps;
  accessibilityBody: StyledRtfProps;
  hoursHeading: StyledTextProps;
  hours: YextEntityField<HoursType>;
  hoursStyles: SummaryHoursStyles;
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
  selectedColor: "#6f594c",
  contrastingColor: "black",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
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

const resolveText = (
  value: YextEntityField<TranslatableString>,
  locale: string,
  streamDocument: Record<string, unknown>,
): string => {
  return resolveComponentData(value, locale, streamDocument)?.toString() ?? "";
};

const createTextCta = (label: string): Partial<ComprehensiveCTAValue> => ({
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

const IndividualPracticeFacilitySummarySectionFields: YextFields<IndividualPracticeFacilitySummarySectionProps> =
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
    contactHeading: {
      label: "Contact Heading",
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
    address: {
      type: "entityField",
      label: "Address",
      filter: {
        types: ["type.address"],
      },
    },
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
    showTextLinkUnderline: {
      label: "Show Text Link Underline",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    phones: {
      label: "Phones",
      type: "object",
      objectFields: {
        items: {
          label: "Items",
          type: "array",
          arrayFields: {
            number: {
              type: "entityField",
              label: "Number",
              filter: {
                types: ["type.phone"],
              },
            },
            label: {
              label: "Label",
              type: "text",
            },
          },
          defaultItemProps: {
            number: {
              field: "",
              constantValue: "",
              constantValueEnabled: true,
            },
            label: "",
          },
          getItemSummary: (_item, index?: number) => `Phone ${index ?? 0}`,
        },
        phoneFormat: {
          label: "Phone Format",
          type: "radio",
          options: [
            { label: "Domestic", value: "domestic" },
            { label: "International", value: "international" },
          ],
        },
        includeHyperlink: {
          label: "Include Hyperlink",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    directionsLink: {
      label: "Directions Link",
      type: "comprehensiveCTA",
    },
    appointmentLink: {
      label: "Appointment Link",
      type: "comprehensiveCTA",
    },
    accessibilityHeading: {
      label: "Accessibility Heading",
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
    accessibilityBody: {
      label: "Accessibility Body",
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
    hoursHeading: {
      label: "Hours Heading",
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
        startOfWeek: {
          label: "Start Of Week",
          type: "select",
          options: [
            { label: "Monday", value: "monday" },
            { label: "Tuesday", value: "tuesday" },
            { label: "Wednesday", value: "wednesday" },
            { label: "Thursday", value: "thursday" },
            { label: "Friday", value: "friday" },
            { label: "Saturday", value: "saturday" },
            { label: "Sunday", value: "sunday" },
            { label: "Today", value: "today" },
          ],
        },
        collapseDays: {
          label: "Collapse Days",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        showAdditionalHoursText: {
          label: "Show Additional Hours Text",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        alignment: {
          label: "Alignment",
          type: "select",
          options: [
            { label: "Start", value: "items-start" },
            { label: "Center", value: "items-center" },
            { label: "End", value: "items-end" },
          ],
        },
      },
    },
  };

const IndividualPracticeFacilitySummarySectionComponent: PuckComponent<IndividualPracticeFacilitySummarySectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const sectionCtaForegroundColor = getDefaultForegroundColor(
      props.section.backgroundColor,
      streamDocument,
    );
    const sectionForeground = props.section.backgroundColor.contrastingColor;
    const textLinkDecoration =
      props.showTextLinkUnderline === false ? "none" : "underline";
    const ctaClassName =
      props.showTextLinkUnderline === false
        ? "yip-facility-summary-cta-no-underline"
        : undefined;
    const directionsCtaVariant = props.directionsLink.styles?.variant;
    const directionsCtaColor = props.directionsLink.styles?.color;
    const renderedDirectionsLink =
      (directionsCtaVariant === "secondary" ||
        directionsCtaVariant === "link") &&
      (!directionsCtaColor ||
        directionsCtaColor.selectedColor === "default") &&
      sectionCtaForegroundColor
        ? {
            ...props.directionsLink,
            styles: {
              ...props.directionsLink.styles,
              color: sectionCtaForegroundColor,
            },
            className: [props.directionsLink.className, ctaClassName]
              .filter(Boolean)
              .join(" "),
          }
        : {
            ...props.directionsLink,
            className: [props.directionsLink.className, ctaClassName]
              .filter(Boolean)
              .join(" "),
          };
    const appointmentCtaVariant = props.appointmentLink.styles?.variant;
    const appointmentCtaColor = props.appointmentLink.styles?.color;
    const renderedAppointmentLink =
      (appointmentCtaVariant === "secondary" ||
        appointmentCtaVariant === "link") &&
      (!appointmentCtaColor ||
        appointmentCtaColor.selectedColor === "default") &&
      sectionCtaForegroundColor
        ? {
            ...props.appointmentLink,
            styles: {
              ...props.appointmentLink.styles,
              color: sectionCtaForegroundColor,
            },
            className: [props.appointmentLink.className, ctaClassName]
              .filter(Boolean)
              .join(" "),
          }
        : {
            ...props.appointmentLink,
            className: [props.appointmentLink.className, ctaClassName]
              .filter(Boolean)
              .join(" "),
          };
    const resolvedAddress = resolveComponentData(
      props.address,
      locale,
      streamDocument,
    );
    const resolvedHours = resolveComponentData(
      props.hours,
      locale,
      streamDocument,
    );
    const accessibilityBodyStyleOverrides = {
      color: props.accessibilityBody.fontColor
        ? getThemeColorCssValue(props.accessibilityBody.fontColor)
        : sectionForeground,
    };
    const resolvedAccessibilityBody = resolveComponentData(
      props.accessibilityBody.text,
      locale,
      streamDocument,
      {
        richTextStyleOverrides: accessibilityBodyStyleOverrides,
      },
    );
    const phones = (props.phones.items ?? [])
      .map((item) => {
        const resolvedNumber = resolveComponentData(
          item.number,
          locale,
          streamDocument,
        );
        const number =
          typeof resolvedNumber === "string" ? resolvedNumber.trim() : "";
        if (!number) {
          return null;
        }

        return {
          label: item.label,
          formatted: formatPhone(number, props.phones.phoneFormat),
          raw: number,
        };
      })
      .filter(
        (
          item,
        ): item is {
          label: string;
          formatted: string;
          raw: string;
        } => item !== null,
      );

    return (
      <VisibilityWrapper
        isEditing={props.puck.isEditing}
        liveVisibility={props.section.visibleOnLivePage}
      >
        <style>{`
          .yip-facility-summary-root p {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-facility-summary-root li {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-facility-summary-root h1 {
            font-family: var(--fontFamily-h1-fontFamily);
            font-size: var(--fontSize-h1-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h1-fontWeight);
            font-style: var(--fontStyle-h1-fontStyle);
            text-transform: var(--textTransform-h1-textTransform);
          }

          .yip-facility-summary-root h2 {
            font-family: var(--fontFamily-h2-fontFamily);
            font-size: var(--fontSize-h2-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h2-fontWeight);
            font-style: var(--fontStyle-h2-fontStyle);
            text-transform: var(--textTransform-h2-textTransform);
          }

          .yip-facility-summary-root h3 {
            font-family: var(--fontFamily-h3-fontFamily);
            font-size: var(--fontSize-h3-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h3-fontWeight);
            font-style: var(--fontStyle-h3-fontStyle);
            text-transform: var(--textTransform-h3-textTransform);
          }

          .yip-facility-summary-root h4 {
            font-family: var(--fontFamily-h4-fontFamily);
            font-size: var(--fontSize-h4-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h4-fontWeight);
            font-style: var(--fontStyle-h4-fontStyle);
            text-transform: var(--textTransform-h4-textTransform);
          }

          .yip-facility-summary-root h5 {
            font-family: var(--fontFamily-h5-fontFamily);
            font-size: var(--fontSize-h5-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h5-fontWeight);
            font-style: var(--fontStyle-h5-fontStyle);
            text-transform: var(--textTransform-h5-textTransform);
          }

          .yip-facility-summary-root h6 {
            font-family: var(--fontFamily-h6-fontFamily);
            font-size: var(--fontSize-h6-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h6-fontWeight);
            font-style: var(--fontStyle-h6-fontStyle);
            text-transform: var(--textTransform-h6-textTransform);
          }

          .yip-facility-summary-root a.yip-facility-summary-text-link,
          .yip-facility-summary-root .yip-facility-summary-rich-text a {
            font-family: var(--fontFamily-link-fontFamily);
            font-size: var(--fontSize-link-fontSize);
            font-weight: var(--fontWeight-link-fontWeight);
            font-style: var(--fontStyle-link-fontStyle);
            line-height: 1.5;
            text-decoration: ${textLinkDecoration};
            text-transform: var(--textTransform-link-textTransform);
            letter-spacing: var(--letterSpacing-link-letterSpacing);
          }

          .yip-facility-summary-root .yip-facility-summary-cta-no-underline {
            text-decoration: none;
          }

          .yip-facility-summary-root .yip-facility-summary-cta-no-underline:hover,
          .yip-facility-summary-root .yip-facility-summary-cta-no-underline:focus,
          .yip-facility-summary-root .yip-facility-summary-cta-no-underline:active {
            text-decoration: underline;
          }
        `}</style>
        <section
          id="contact"
          className="yip-facility-summary-root px-4 py-pageSection-verticalPadding"
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
            <div style={{ padding: "40px 0" }}>
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
                    margin: "0 0 40px",
                    textAlign: "center",
                    textTransform:
                      props.heading.styles.textTransform === "default"
                        ? undefined
                        : props.heading.styles.textTransform,
                  }}
                >
                  {resolveText(props.heading.text, locale, streamDocument)}
                </h2>
              </EntityField>
              <div
                style={{
                  display: "grid",
                  gap: "32px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                }}
              >
                <article>
                  <EntityField
                    displayName="Contact Heading"
                    fieldId={props.contactHeading.text.field}
                    constantValueEnabled={
                      props.contactHeading.text.constantValueEnabled
                    }
                  >
                    <h3
                      style={{
                        color: props.contactHeading.fontColor
                          ? getThemeColorCssValue(props.contactHeading.fontColor)
                          : sectionForeground,
                        fontFamily:
                          props.contactHeading.styles.fontFamily === "default"
                            ? undefined
                            : props.contactHeading.styles.fontFamily,
                        fontSize:
                          props.contactHeading.styles.fontSize === "default"
                            ? undefined
                            : props.contactHeading.styles.fontSize,
                        fontStyle:
                          props.contactHeading.styles.fontStyle === "default"
                            ? undefined
                            : props.contactHeading.styles.fontStyle,
                        fontWeight:
                          props.contactHeading.styles.fontWeight === "default"
                            ? undefined
                            : props.contactHeading.styles.fontWeight,
                        marginBottom: "14px",
                        textTransform:
                          props.contactHeading.styles.textTransform === "default"
                            ? undefined
                            : props.contactHeading.styles.textTransform,
                      }}
                    >
                      {resolveText(
                        props.contactHeading.text,
                        locale,
                        streamDocument,
                      )}
                    </h3>
                  </EntityField>
                  {resolvedAddress ? (
                    <EntityField
                      displayName="Address"
                      fieldId={props.address.field}
                      constantValueEnabled={props.address.constantValueEnabled}
                    >
                      <Address
                        address={resolvedAddress}
                        showRegion={props.showRegion}
                        showCountry={props.showCountry}
                      />
                    </EntityField>
                  ) : null}
                  <div style={{ margin: "8px 0 0" }}>
                    <EntityField
                      displayName="Directions Link"
                      fieldId={props.directionsLink.data?.cta?.field}
                      constantValueEnabled={
                        props.directionsLink.data?.cta?.constantValueEnabled
                      }
                    >
                      <ComprehensiveCTA
                        value={
                          renderedDirectionsLink as Partial<ComprehensiveCTAValue>
                        }
                        eventName="getDirections"
                      />
                    </EntityField>
                  </div>
                  {phones.map((item, index) => (
                    <EntityField
                      key={index}
                      displayName="Phone"
                      fieldId={props.phones.items[index]?.number.field}
                      constantValueEnabled={
                        props.phones.items[index]?.number.constantValueEnabled
                      }
                    >
                      <p style={{ margin: "8px 0 0" }}>
                        {props.phones.includeHyperlink ? (
                          <Link
                            cta={{
                              link: item.raw,
                              linkType: "PHONE",
                            }}
                            eventName={`phone${index}`}
                            className="yip-facility-summary-text-link"
                          >
                            {item.label
                              ? `${item.label} ${item.formatted}`
                              : item.formatted}
                          </Link>
                        ) : item.label ? (
                          `${item.label} ${item.formatted}`
                        ) : (
                          item.formatted
                        )}
                      </p>
                    </EntityField>
                  ))}
                  <div style={{ margin: "8px 0 0" }}>
                    <EntityField
                      displayName="Appointment Link"
                      fieldId={props.appointmentLink.data?.cta?.field}
                      constantValueEnabled={
                        props.appointmentLink.data?.cta?.constantValueEnabled
                      }
                    >
                      <ComprehensiveCTA
                        value={
                          renderedAppointmentLink as Partial<ComprehensiveCTAValue>
                        }
                        eventName="primaryCta"
                      />
                    </EntityField>
                  </div>
                </article>
                <article>
                  <EntityField
                    displayName="Accessibility Heading"
                    fieldId={props.accessibilityHeading.text.field}
                    constantValueEnabled={
                      props.accessibilityHeading.text.constantValueEnabled
                    }
                  >
                    <h3
                      style={{
                        color: props.accessibilityHeading.fontColor
                          ? getThemeColorCssValue(
                              props.accessibilityHeading.fontColor,
                            )
                          : sectionForeground,
                        fontFamily:
                          props.accessibilityHeading.styles.fontFamily ===
                          "default"
                            ? undefined
                            : props.accessibilityHeading.styles.fontFamily,
                        fontSize:
                          props.accessibilityHeading.styles.fontSize === "default"
                            ? undefined
                            : props.accessibilityHeading.styles.fontSize,
                        fontStyle:
                          props.accessibilityHeading.styles.fontStyle ===
                          "default"
                            ? undefined
                            : props.accessibilityHeading.styles.fontStyle,
                        fontWeight:
                          props.accessibilityHeading.styles.fontWeight ===
                          "default"
                            ? undefined
                            : props.accessibilityHeading.styles.fontWeight,
                        marginBottom: "14px",
                        textTransform:
                          props.accessibilityHeading.styles.textTransform ===
                          "default"
                            ? undefined
                            : props.accessibilityHeading.styles.textTransform,
                      }}
                    >
                      {resolveText(
                        props.accessibilityHeading.text,
                        locale,
                        streamDocument,
                      )}
                    </h3>
                  </EntityField>
                  <EntityField
                    displayName="Accessibility Body"
                    fieldId={props.accessibilityBody.text.field}
                    constantValueEnabled={
                      props.accessibilityBody.text.constantValueEnabled
                    }
                  >
                    <div
                      className="yip-facility-summary-rich-text"
                      style={{ lineHeight: 1.6 }}
                    >
                      {React.isValidElement(resolvedAccessibilityBody) ? (
                        resolvedAccessibilityBody
                      ) : (
                        <MaybeRTF
                          data={
                            typeof resolvedAccessibilityBody === "string"
                              ? resolvedAccessibilityBody
                              : ""
                          }
                          richTextStyleOverrides={accessibilityBodyStyleOverrides}
                        />
                      )}
                    </div>
                  </EntityField>
                </article>
                <article>
                  <EntityField
                    displayName="Hours Heading"
                    fieldId={props.hoursHeading.text.field}
                    constantValueEnabled={
                      props.hoursHeading.text.constantValueEnabled
                    }
                  >
                    <h3
                      style={{
                        color: props.hoursHeading.fontColor
                          ? getThemeColorCssValue(props.hoursHeading.fontColor)
                          : sectionForeground,
                        fontFamily:
                          props.hoursHeading.styles.fontFamily === "default"
                            ? undefined
                            : props.hoursHeading.styles.fontFamily,
                        fontSize:
                          props.hoursHeading.styles.fontSize === "default"
                            ? undefined
                            : props.hoursHeading.styles.fontSize,
                        fontStyle:
                          props.hoursHeading.styles.fontStyle === "default"
                            ? undefined
                            : props.hoursHeading.styles.fontStyle,
                        fontWeight:
                          props.hoursHeading.styles.fontWeight === "default"
                            ? undefined
                            : props.hoursHeading.styles.fontWeight,
                        marginBottom: "14px",
                        textTransform:
                          props.hoursHeading.styles.textTransform === "default"
                            ? undefined
                            : props.hoursHeading.styles.textTransform,
                      }}
                    >
                      {resolveText(
                        props.hoursHeading.text,
                        locale,
                        streamDocument,
                      )}
                    </h3>
                  </EntityField>
                  {resolvedHours ? (
                    <EntityField
                      displayName="Hours"
                      fieldId={props.hours.field}
                      constantValueEnabled={props.hours.constantValueEnabled}
                    >
                      <div className={`flex flex-col ${props.hoursStyles.alignment}`}>
                        <HoursTable
                          hours={resolvedHours}
                          comingSoon={Boolean(streamDocument.comingSoon)}
                          startOfWeek={props.hoursStyles.startOfWeek}
                          collapseDays={props.hoursStyles.collapseDays}
                        />
                        {props.hoursStyles.showAdditionalHoursText &&
                        typeof streamDocument.additionalHoursText === "string" &&
                        streamDocument.additionalHoursText.trim() ? (
                          <p style={{ margin: "12px 0 0" }}>
                            {streamDocument.additionalHoursText}
                          </p>
                        ) : null}
                      </div>
                    </EntityField>
                  ) : null}
                </article>
              </div>
            </div>
          </div>
        </section>
      </VisibilityWrapper>
    );
  };

export const IndividualPracticeFacilitySummarySection: YextComponentConfig<IndividualPracticeFacilitySummarySectionProps> =
  {
    label: "Facility Summary Section",
    fields: IndividualPracticeFacilitySummarySectionFields,
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "🏥 Facility Summary",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: primaryTextColor,
      },
      contactHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Contact Us",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      address: {
        field: "address",
        constantValue: {
          line1: "",
          city: "",
          postalCode: "",
          countryCode: "",
          region: "",
        },
        constantValueEnabled: false,
      },
      showRegion: true,
      showCountry: false,
      showTextLinkUnderline: true,
      phones: {
        items: [
          {
            number: {
              field: "mainPhone",
              constantValue: "",
              constantValueEnabled: false,
            },
            label: "Main Phone:",
          },
        ],
        phoneFormat: "domestic",
        includeHyperlink: true,
      },
      directionsLink: createTextCta("Get directions"),
      appointmentLink: createTextCta("Make an appointment"),
      accessibilityHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Accessibility",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      accessibilityBody: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Wheelchair accessible entrances, mobility accessible routes, elevators, accessible restrooms, and patient drop-off.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: bodyTextColor,
      },
      hoursHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Opening Hours",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      hours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      },
      hoursStyles: {
        startOfWeek: "today",
        collapseDays: false,
        showAdditionalHoursText: false,
        alignment: "items-start",
      },
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeFacilitySummarySection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeFacilitySummarySectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeFacilitySummarySection",
  displayName: "Facility Summary Section",
  description: "Facility Summary Section",
  pageSetTypes: ["ENTITY"],
};
