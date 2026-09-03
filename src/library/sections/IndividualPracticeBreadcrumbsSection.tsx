import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";
import {
  EntityField,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  resolveBreadcrumbs,
  resolveComponentData,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  useDocument,
  useTemplateProps,
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

type BreadcrumbItem = {
  name?: string;
  slug?: string;
  index?: number;
};

type BreadcrumbDocument = {
  address?: {
    line1?: string;
  };
  locale?: string;
  name?: string;
};

type IndividualPracticeBreadcrumbsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  rootLabel: StyledTextProps;
  includeCurrentLocation: boolean;
  separator: string;
};

const whiteBackground: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const primaryColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "0.8125rem",
  fontWeight: "500",
  fontStyle: "default",
  textTransform: "uppercase",
};

const IndividualPracticeBreadcrumbsSectionFields: YextFields<IndividualPracticeBreadcrumbsSectionProps> =
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
    rootLabel: {
      label: "Root Label",
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
    includeCurrentLocation: {
      label: "Include Current Location",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    separator: {
      label: "Separator",
      type: "text",
    },
  };

const IndividualPracticeBreadcrumbsSectionComponent: PuckComponent<
  IndividualPracticeBreadcrumbsSectionProps
> = (props) => {
    const streamDocument = useDocument<BreadcrumbDocument>();
    const locale = streamDocument.locale ?? "en";
    const { relativePrefixToRoot } = useTemplateProps<{
      relativePrefixToRoot?: string;
    }>();
    const breadcrumbs = (resolveBreadcrumbs(streamDocument) ?? []) as
    BreadcrumbItem[] | undefined;

    if (!breadcrumbs?.length) {
    return props.puck.isEditing ? (
      <p
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "18px 24px",
        }}
      >
        No breadcrumbs available (section will be hidden on live page). Create a
        directory to enable breadcrumbs.
      </p>
    ) : (
      <></>
    );
    }

    const visibleBreadcrumbs =
      !props.includeCurrentLocation && breadcrumbs.length > 1
        ? breadcrumbs.slice(0, -1)
        : breadcrumbs;
    const resolvedRootLabel =
      resolveComponentData(
        props.rootLabel.text,
        locale,
        streamDocument,
      )?.toString() ?? "";
    const currentPageLabel =
      streamDocument.name || streamDocument.address?.line1 || "";
    const linkColor = getThemeColorCssValue(
      props.rootLabel.fontColor ?? props.section.backgroundColor.contrastingColor,
    );
    const currentPageColor = getThemeColorCssValue(
      props.section.backgroundColor.contrastingColor,
    );
    const separatorColor = `color-mix(in srgb, ${currentPageColor} 48%, transparent)`;
    const linkTextStyle: React.CSSProperties = {
      color: linkColor,
      fontFamily:
        props.rootLabel.styles.fontFamily === "default"
          ? "var(--fontFamily-body-fontFamily)"
          : props.rootLabel.styles.fontFamily,
      fontSize:
        props.rootLabel.styles.fontSize === "default"
          ? "0.8125rem"
          : props.rootLabel.styles.fontSize,
      fontStyle:
        props.rootLabel.styles.fontStyle === "default"
          ? undefined
          : props.rootLabel.styles.fontStyle,
      fontWeight:
        props.rootLabel.styles.fontWeight === "default"
          ? 500
          : props.rootLabel.styles.fontWeight,
      letterSpacing: "0.08em",
      lineHeight: 1.4,
      textDecoration: "none",
      textTransform:
        props.rootLabel.styles.textTransform === "default"
          ? undefined
          : props.rootLabel.styles.textTransform,
    };

    return (
      <VisibilityWrapper
        isEditing={props.puck.isEditing}
        liveVisibility={props.section.visibleOnLivePage}
      >
        <section
          className="yip-breadcrumbs-root px-4 py-4"
          style={{
            backgroundColor: getThemeColorCssValue(props.section.backgroundColor),
            borderBottom: `1px solid color-mix(in srgb, ${currentPageColor} 10%, transparent)`,
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: "min(100%, 73rem)",
            }}
          >
            <ol
              style={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {visibleBreadcrumbs.map((breadcrumb, index) => {
                const isRoot = index === 0;
                const isCurrentPage = index === visibleBreadcrumbs.length - 1;
                const href = relativePrefixToRoot
                  ? `${relativePrefixToRoot}${breadcrumb.slug ?? ""}`
                  : (breadcrumb.slug ?? "");
                let label = breadcrumb.name ?? "";
                if (isRoot && resolvedRootLabel) {
                  label = resolvedRootLabel;
                } else if (isCurrentPage && props.includeCurrentLocation) {
                  label = currentPageLabel || label;
                }

                return (
                  <li
                    key={`${breadcrumb.slug ?? label}-${index}`}
                    style={{
                      alignItems: "center",
                      display: "inline-flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    {index > 0 ? (
                      <span
                        aria-hidden
                        style={{
                          color: separatorColor,
                          fontSize: "0.75rem",
                          lineHeight: 1,
                        }}
                      >
                        {props.separator}
                      </span>
                    ) : null}
                    {isCurrentPage ? (
                      <span
                        style={{
                          ...linkTextStyle,
                          color: currentPageColor,
                          letterSpacing: "0.04em",
                          textTransform: "none",
                        }}
                      >
                        {label}
                      </span>
                    ) : isRoot ? (
                      <EntityField
                        displayName="Root Label"
                        fieldId={props.rootLabel.text.field}
                        constantValueEnabled={
                          props.rootLabel.text.constantValueEnabled
                        }
                      >
                        <Link eventName={`breadcrumb${index}`} href={href}>
                          <span style={linkTextStyle}>{label}</span>
                        </Link>
                      </EntityField>
                    ) : (
                      <Link eventName={`breadcrumb${index}`} href={href}>
                        <span style={linkTextStyle}>{label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </VisibilityWrapper>
    );
  };

export const IndividualPracticeBreadcrumbsSection: YextComponentConfig<IndividualPracticeBreadcrumbsSectionProps> =
  {
    label: "Breadcrumbs",
    fields: IndividualPracticeBreadcrumbsSectionFields,
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      rootLabel: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "All Locations",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: primaryColor,
      },
      includeCurrentLocation: true,
      separator: "/",
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeBreadcrumbsSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeBreadcrumbsSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeBreadcrumbsSection",
  displayName: "Breadcrumbs",
  description: "Breadcrumbs",
  pageSetTypes: ["ENTITY"],
};
