import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";
import {
  createItemSource,
  EntityField,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  Image,
  resolveComponentData,
  type StyledTextValue,
  type StyledImageValue,
  type ThemeColor,
  type TranslatableAssetImage,
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

type ProviderTextProps = {
  text: YextEntityField<TranslatableString>;
};

type ProviderTextListProps = {
  text: YextEntityField<TranslatableString[]>;
};

type ProvidersCardStyles = {
  cardBackgroundColor: ThemeColor;
  nameTextStyles: StyledTextValue;
  nameFontColor?: ThemeColor;
  roleTextStyles: StyledTextValue;
  roleFontColor?: ThemeColor;
  credentialsTextStyles: StyledTextValue;
  credentialsFontColor?: ThemeColor;
  specialtiesTextStyles: StyledTextValue;
  specialtiesFontColor?: ThemeColor;
  imageStyles?: StyledImageValue;
  imageAspectRatio: number;
  imageConstrain: "fixed" | "filled";
};

type ProviderItem = {
  name: ProviderTextProps;
  role: ProviderTextProps;
  credentialsLabel: YextEntityField<TranslatableString>;
  credentials: ProviderTextProps;
  specialtiesLabel: YextEntityField<TranslatableString>;
  specialties: ProviderTextListProps;
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
};

type IndividualPracticeProvidersSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  cardStyles: ProvidersCardStyles;
  items: typeof providerItemsSource.value;
};

const whiteBackground: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const bodyTextColor: ThemeColor = {
  selectedColor: "#6f594c",
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

const createProviderTextField = (defaultValue: string): ProviderTextProps => ({
  text: {
    field: "",
    constantValue: {
      defaultValue,
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
});

const createProviderLabelField = (
  defaultValue: string,
): YextEntityField<TranslatableString> => ({
  field: "",
  constantValue: {
    defaultValue,
    hasLocalizedValue: "true",
  },
  constantValueEnabled: true,
});

const createTextListField = (
  defaultValue: string[],
): ProviderTextListProps => ({
  text: {
    field: "",
    constantValue: defaultValue,
    constantValueEnabled: true,
  },
});

const resolveText = (
  value: YextEntityField<TranslatableString> | TranslatableString | undefined,
  locale: string,
  streamDocument: Record<string, unknown>,
): string => {
  return resolveComponentData(value, locale, streamDocument, {
    output: "plainText",
  });
};

const providerItemsSource = createItemSource<ProviderItem>({
  label: "Providers",
  mappingFields: {
    name: {
      label: "Name",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
      },
    },
    role: {
      label: "Role",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
      },
    },
    credentialsLabel: {
      type: "entityField",
      label: "Board Certification Label",
      filter: { types: ["type.string"] },
    },
    credentials: {
      label: "Credentials",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
      },
    },
    specialtiesLabel: {
      type: "entityField",
      label: "Specialties Label",
      filter: { types: ["type.string"] },
    },
    specialties: {
      label: "Specialties",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text List",
          filter: { types: ["type.string"], includeListsOnly: true },
        },
      },
    },
    image: {
      type: "entityField",
      label: "Image",
      filter: { types: ["type.image"] },
    },
  },
  defaultValues: [
    {
      name: createProviderTextField("Dr Elena Rodriguez, MD"),
      role: createProviderTextField("Chief of Medicine"),
      credentialsLabel: createProviderLabelField("Board Certification"),
      credentials: createProviderTextField("American Board of Family Medicine"),
      specialtiesLabel: createProviderLabelField("Specialties"),
      specialties: createTextListField([
        "Emergency medicine",
        "acute care stabilization",
        "chronic disease management",
      ]),
      image: createImageField(
        "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
        1900,
        1267,
      ),
    },
    {
      name: createProviderTextField("Dr Thomas Hayes, DO"),
      role: createProviderTextField("Urgent Care Director"),
      credentialsLabel: createProviderLabelField("Board Certification"),
      credentials: createProviderTextField(
        "American Board of Emergency Medicine",
      ),
      specialtiesLabel: createProviderLabelField("Specialties"),
      specialties: createTextListField([
        "Minor trauma",
        "orthopedics",
        "laceration repair",
        "pediatric urgent care",
      ]),
      image: createImageField(
        "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
        1900,
        1267,
      ),
    },
    {
      name: createProviderTextField("Laura Croft, FNP-BC"),
      role: createProviderTextField("Family Nurse Practitioner"),
      credentialsLabel: createProviderLabelField("Board Certification"),
      credentials: createProviderTextField("ANCC Certified"),
      specialtiesLabel: createProviderLabelField("Specialties"),
      specialties: createTextListField([
        "Preventive health",
        "chronic disease management",
        "wellness coaching",
      ]),
      image: createImageField(
        "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
        1900,
        1267,
      ),
    },
    {
      name: createProviderTextField("Stephen Merriack, PA-C"),
      role: createProviderTextField("Physician Assistant"),
      credentialsLabel: createProviderLabelField("Board Certification"),
      credentials: createProviderTextField("NCCPA Certified"),
      specialtiesLabel: createProviderLabelField("Specialties"),
      specialties: createTextListField([
        "Sports medicine",
        "wound care",
        "occupational health",
      ]),
      image: createImageField(
        "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
        1900,
        1267,
      ),
    },
  ],
});

const IndividualPracticeProvidersSectionFields: YextFields<IndividualPracticeProvidersSectionProps> =
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
    cardStyles: {
      label: "Card Styles",
      type: "object",
      objectFields: {
        cardBackgroundColor: {
          label: "Card Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        nameTextStyles: {
          label: "Name Text Styles",
          type: "styledText",
        },
        nameFontColor: {
          label: "Name Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        roleTextStyles: {
          label: "Role Text Styles",
          type: "styledText",
        },
        roleFontColor: {
          label: "Role Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        credentialsTextStyles: {
          label: "Credentials Text Styles",
          type: "styledText",
        },
        credentialsFontColor: {
          label: "Credentials Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        specialtiesTextStyles: {
          label: "Specialties Text Styles",
          type: "styledText",
        },
        specialtiesFontColor: {
          label: "Specialties Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        imageStyles: {
          label: "Image Styles",
          type: "styledImage",
        },
        imageAspectRatio: {
          label: "Image Aspect Ratio",
          type: "basicSelector",
          options: "ASPECT_RATIO",
        },
        imageConstrain: {
          label: "Image Constrain",
          type: "select",
          options: [
            { label: "Fixed", value: "fixed" },
            { label: "Filled", value: "filled" },
          ],
        },
      },
    },
    items: providerItemsSource.field,
  };

const IndividualPracticeProvidersSectionComponent: PuckComponent<
  IndividualPracticeProvidersSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const heading = resolveText(props.heading.text, locale, streamDocument);
  const nameTextStyles = props.cardStyles.nameTextStyles;
  const roleTextStyles = props.cardStyles.roleTextStyles;
  const credentialsTextStyles = props.cardStyles.credentialsTextStyles;
  const specialtiesTextStyles = props.cardStyles.specialtiesTextStyles;
  const cardForeground = getThemeColorCssValue(
    props.cardStyles.cardBackgroundColor.contrastingColor,
  );
  const cardShadow = `0 20px 48px color-mix(in srgb, ${cardForeground} 6%, transparent)`;
  const items = providerItemsSource.resolveItems(props.items, streamDocument);

  return (
    <VisibilityWrapper
      isEditing={props.puck.isEditing}
      liveVisibility={props.section.visibleOnLivePage}
    >
      <style>{`
          .yip-providers-root p {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-providers-root li {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-providers-root h1 {
            font-family: var(--fontFamily-h1-fontFamily);
            font-size: var(--fontSize-h1-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h1-fontWeight);
            font-style: var(--fontStyle-h1-fontStyle);
            text-transform: var(--textTransform-h1-textTransform);
          }

          .yip-providers-root h2 {
            font-family: var(--fontFamily-h2-fontFamily);
            font-size: var(--fontSize-h2-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h2-fontWeight);
            font-style: var(--fontStyle-h2-fontStyle);
            text-transform: var(--textTransform-h2-textTransform);
          }

          .yip-providers-root h3 {
            font-family: var(--fontFamily-h3-fontFamily);
            font-size: var(--fontSize-h3-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h3-fontWeight);
            font-style: var(--fontStyle-h3-fontStyle);
            text-transform: var(--textTransform-h3-textTransform);
          }

          .yip-providers-root h4 {
            font-family: var(--fontFamily-h4-fontFamily);
            font-size: var(--fontSize-h4-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h4-fontWeight);
            font-style: var(--fontStyle-h4-fontStyle);
            text-transform: var(--textTransform-h4-textTransform);
          }

          .yip-providers-root h5 {
            font-family: var(--fontFamily-h5-fontFamily);
            font-size: var(--fontSize-h5-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h5-fontWeight);
            font-style: var(--fontStyle-h5-fontStyle);
            text-transform: var(--textTransform-h5-textTransform);
          }

          .yip-providers-root h6 {
            font-family: var(--fontFamily-h6-fontFamily);
            font-size: var(--fontSize-h6-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h6-fontWeight);
            font-style: var(--fontStyle-h6-fontStyle);
            text-transform: var(--textTransform-h6-textTransform);
          }

          .yip-providers-root a.yip-providers-text-link,
          .yip-providers-root .yip-providers-rich-text a {
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
            .yip-providers-grid {
              grid-template-columns: 1fr !important;
            }

            .yip-provider-card {
              grid-template-columns: 1fr !important;
            }

            .yip-provider-card-content {
              order: 1;
            }

            .yip-provider-card-image {
              order: 2;
              width: 100%;
            }
          }
        `}</style>
      <section
        id="providers"
        className="yip-providers-root px-4 py-pageSection-verticalPadding"
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
          </div>
          <EntityField
            displayName="Providers"
            fieldId={props.items.field}
            constantValueEnabled={props.items.constantValueEnabled}
          >
            <div
              className="yip-providers-grid"
              style={{
                display: "grid",
                gap: "24px",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              }}
            >
              {items.map((item, index) => {
                const name = resolveText(
                  item.name.text,
                  locale,
                  streamDocument,
                );
                const role = resolveText(
                  item.role.text,
                  locale,
                  streamDocument,
                );
                const credentialsLabel = resolveText(
                  item.credentialsLabel,
                  locale,
                  streamDocument,
                );
                const credentials = resolveText(
                  item.credentials.text,
                  locale,
                  streamDocument,
                );
                const specialtiesLabel = resolveText(
                  item.specialtiesLabel,
                  locale,
                  streamDocument,
                );
                const specialtyList = (item.specialties.text ?? []).map(
                  (specialty) =>
                    resolveComponentData(specialty, locale, streamDocument, {
                      output: "plainText",
                    }),
                );
                const image = item.image as
                  | ImageType
                  | ComplexImageType
                  | TranslatableAssetImage
                  | undefined;
                const imageBorderRadius =
                  props.cardStyles.imageStyles?.borderRadius === "default"
                    ? "12px"
                    : props.cardStyles.imageStyles?.borderRadius;
                const providerSubheadingStyle: React.CSSProperties = {
                  color: cardForeground,
                  fontWeight: 700,
                };
                const providerMetadataRowStyle: React.CSSProperties = {
                  alignItems: "baseline",
                  color: cardForeground,
                  columnGap: "0.25rem",
                  display: "flex",
                  flexWrap: "wrap",
                  margin: 0,
                  rowGap: "0.125rem",
                };

                return (
                  <article
                    className="yip-provider-card"
                    key={`${name}-${index}`}
                    style={{
                      alignItems: "stretch",
                      backgroundColor: getThemeColorCssValue(
                        props.cardStyles.cardBackgroundColor,
                      ),
                      borderRadius: "20px",
                      boxShadow: cardShadow,
                      display: "grid",
                      gap: "12px",
                      gridTemplateColumns: "minmax(0, 1fr) 12.5rem",
                      padding: "16px",
                    }}
                  >
                    <div
                      className="yip-provider-card-content"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: "10px",
                      }}
                    >
                      <h3
                        style={{
                          color: getThemeColorCssValue(
                            props.cardStyles.nameFontColor ??
                              props.cardStyles.cardBackgroundColor
                                .contrastingColor,
                          ),
                          fontFamily:
                            nameTextStyles.fontFamily === "default"
                              ? undefined
                              : nameTextStyles.fontFamily,
                          fontSize:
                            nameTextStyles.fontSize === "default"
                              ? "1.5rem"
                              : nameTextStyles.fontSize,
                          fontStyle:
                            nameTextStyles.fontStyle === "default"
                              ? undefined
                              : nameTextStyles.fontStyle,
                          fontWeight:
                            nameTextStyles.fontWeight === "default"
                              ? undefined
                              : nameTextStyles.fontWeight,
                          lineHeight: 1.25,
                          margin: 0,
                          textTransform:
                            nameTextStyles.textTransform === "default"
                              ? undefined
                              : nameTextStyles.textTransform,
                        }}
                      >
                        {name}
                      </h3>
                      <p
                        style={{
                          color: getThemeColorCssValue(
                            props.cardStyles.roleFontColor ??
                              props.cardStyles.cardBackgroundColor
                                .contrastingColor,
                          ),
                          fontFamily:
                            roleTextStyles.fontFamily === "default"
                              ? undefined
                              : roleTextStyles.fontFamily,
                          fontSize:
                            roleTextStyles.fontSize === "default"
                              ? "1.12rem"
                              : roleTextStyles.fontSize,
                          fontStyle:
                            roleTextStyles.fontStyle === "default"
                              ? undefined
                              : roleTextStyles.fontStyle,
                          fontWeight:
                            roleTextStyles.fontWeight === "default"
                              ? 500
                              : roleTextStyles.fontWeight,
                          margin: 0,
                          textTransform:
                            roleTextStyles.textTransform === "default"
                              ? undefined
                              : roleTextStyles.textTransform,
                        }}
                      >
                        {role}
                      </p>
                      <div style={providerMetadataRowStyle}>
                        <strong style={providerSubheadingStyle}>
                          {`${credentialsLabel}:`}
                        </strong>
                        <span
                          style={{
                            color: getThemeColorCssValue(
                              props.cardStyles.credentialsFontColor ??
                                props.cardStyles.cardBackgroundColor
                                  .contrastingColor,
                            ),
                            fontFamily:
                              credentialsTextStyles.fontFamily === "default"
                                ? undefined
                                : credentialsTextStyles.fontFamily,
                            fontSize:
                              credentialsTextStyles.fontSize === "default"
                                ? undefined
                                : credentialsTextStyles.fontSize,
                            fontStyle:
                              credentialsTextStyles.fontStyle === "default"
                                ? undefined
                                : credentialsTextStyles.fontStyle,
                            fontWeight:
                              credentialsTextStyles.fontWeight === "default"
                                ? undefined
                                : credentialsTextStyles.fontWeight,
                            textTransform:
                              credentialsTextStyles.textTransform === "default"
                                ? undefined
                                : credentialsTextStyles.textTransform,
                          }}
                        >
                          {credentials}
                        </span>
                      </div>
                      <div style={providerMetadataRowStyle}>
                        <strong style={providerSubheadingStyle}>
                          {`${specialtiesLabel}:`}
                        </strong>
                        <span
                          style={{
                            color: getThemeColorCssValue(
                              props.cardStyles.specialtiesFontColor ??
                                props.cardStyles.cardBackgroundColor
                                  .contrastingColor,
                            ),
                            fontFamily:
                              specialtiesTextStyles.fontFamily === "default"
                                ? undefined
                                : specialtiesTextStyles.fontFamily,
                            fontSize:
                              specialtiesTextStyles.fontSize === "default"
                                ? undefined
                                : specialtiesTextStyles.fontSize,
                            fontStyle:
                              specialtiesTextStyles.fontStyle === "default"
                                ? undefined
                                : specialtiesTextStyles.fontStyle,
                            fontWeight:
                              specialtiesTextStyles.fontWeight === "default"
                                ? undefined
                                : specialtiesTextStyles.fontWeight,
                            textTransform:
                              specialtiesTextStyles.textTransform === "default"
                                ? undefined
                                : specialtiesTextStyles.textTransform,
                          }}
                        >
                          {specialtyList.map((specialty, specialtyIndex) => (
                            <React.Fragment
                              key={`${specialty}-${specialtyIndex}`}
                            >
                              {specialtyIndex > 0 ? ", " : null}
                              {specialty}
                            </React.Fragment>
                          ))}
                        </span>
                      </div>
                    </div>
                    {image ? (
                      <div
                        className="yip-provider-card-image"
                        style={{
                          aspectRatio:
                            props.cardStyles.imageAspectRatio > 0
                              ? props.cardStyles.imageAspectRatio
                              : undefined,
                          borderRadius: imageBorderRadius,
                          height:
                            props.cardStyles.imageAspectRatio > 0
                              ? undefined
                              : "18.75rem",
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

export const IndividualPracticeProvidersSection: YextComponentConfig<IndividualPracticeProvidersSectionProps> =
  {
    label: "Providers Section",
    fields: IndividualPracticeProvidersSectionFields,
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      heading: createTextField("Meet Our Providers"),
      cardStyles: {
        cardBackgroundColor: whiteBackground,
        nameTextStyles: defaultTextStyles,
        roleTextStyles: defaultTextStyles,
        credentialsTextStyles: defaultTextStyles,
        credentialsFontColor: bodyTextColor,
        specialtiesTextStyles: defaultTextStyles,
        specialtiesFontColor: bodyTextColor,
        imageStyles: defaultImageStyles,
        imageAspectRatio: 1.5,
        imageConstrain: "filled",
      },
      items: providerItemsSource.defaultValue,
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeProvidersSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeProvidersSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeProvidersSection",
  displayName: "Providers Section",
  description: "Providers Section",
  pageSetTypes: ["ENTITY"],
};
