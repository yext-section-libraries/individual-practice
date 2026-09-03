import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { parsePhoneNumber } from "awesome-phonenumber";
import type { PuckComponent } from "@puckeditor/core";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaSnapchatGhost,
  FaTiktok,
  FaYoutube,
  FaYelp,
} from "react-icons/fa";
import {
  Address,
  AnalyticsScopeProvider,
  Link,
  type AddressType,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";
import {
  type EnhancedTranslatableCTA,
  EntityField,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  Image,
  resolveComponentData,
  type StyledTextValue,
  type StyledImageValue,
  type ThemeColor,
  ThemeOptions,
  type TranslatableAssetImage,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextCTAField,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

type FooterImage = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type FooterLink = {
  cta: YextCTAField;
};

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type PhoneItemProps = {
  number: YextEntityField<string>;
  label?: string;
};

type PhoneFieldProps = {
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

type ResolvedPhoneItem = {
  label: string;
  originalNumber: string;
  formattedNumber: string;
  telDigits: string;
  fieldId: string;
  constantValueEnabled: boolean | undefined;
};

type SocialLink = {
  cta: YextCTAField;
  ariaLabel: string;
  icon:
    | "linkedin"
    | "instagram"
    | "youtube"
    | "facebook"
    | "pinterest"
    | "snapchat"
    | "tiktok"
    | "yelp";
};

type IndividualPracticeFooterProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  logoImage: FooterImage;
  navHeading: StyledTextProps;
  navLinks: FooterLink[];
  address: YextEntityField<AddressType>;
  showRegion: boolean;
  showCountry: boolean;
  phone: PhoneFieldProps;
  socialLinks: SocialLink[];
};

const whiteBackground: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
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

const socialIcons: Record<
  SocialLink["icon"],
  React.ComponentType<{ className?: string }>
> = {
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  youtube: FaYoutube,
  facebook: FaFacebookF,
  pinterest: FaPinterestP,
  snapchat: FaSnapchatGhost,
  tiktok: FaTiktok,
  yelp: FaYelp,
};

const createImageField = (
  url: string,
  width: number,
  height: number,
  aspectRatio: number,
): FooterImage => ({
  image: {
    field: "",
    constantValueEnabled: true,
    constantValue: {
      url,
      width,
      height,
    },
  },
  aspectRatio,
  imageConstrain: "fixed",
  styles: defaultImageStyles,
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

const createCtaField = (
  label: string,
  link: string,
  openInNewTab = false,
): YextCTAField => ({
  field: "",
  constantValue: {
    label: {
      defaultValue: label,
    },
    link: {
      defaultValue: link,
    },
    linkType: "URL",
    openInNewTab,
  },
  constantValueEnabled: true,
});

const formatPhoneNumber = (
  phoneNumberString: string,
  format: "international" | "domestic",
): string => {
  const cleanedPhoneNumberString = phoneNumberString.replace(
    /(?!^\+)\+|[^\d+]/g,
    "",
  );

  const parsedPhoneNumber = parsePhoneNumber(cleanedPhoneNumberString);
  if (!parsedPhoneNumber.valid || parsedPhoneNumber.number === undefined) {
    return phoneNumberString;
  }

  return format === "international"
    ? parsedPhoneNumber.number.international
    : parsedPhoneNumber.number.national;
};

const IndividualPracticeFooterFields: YextFields<IndividualPracticeFooterProps> =
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
    logoImage: {
      label: "Logo Image",
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
    navHeading: {
      label: "Navigation Heading",
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
    navLinks: {
      label: "Navigation Links",
      type: "array",
      arrayFields: {
        cta: {
          label: "Link",
          type: "entityField",
          filter: {
            types: ["type.cta"],
          },
        },
      },
      defaultItemProps: {
        cta: createCtaField("Link", "#"),
      },
      getItemSummary: (item: FooterLink) =>
        typeof item.cta.constantValue?.label === "string"
          ? item.cta.constantValue.label
          : item.cta.constantValue?.label?.defaultValue ||
            item.cta.field ||
            "Link",
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
    phone: {
      label: "Phone",
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
          getItemSummary: (item) =>
            item.label || item.number?.constantValue || item.number?.field || "Phone",
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
    socialLinks: {
      label: "Social Links",
      type: "array",
      arrayFields: {
        cta: {
          label: "Link",
          type: "entityField",
          filter: {
            types: ["type.cta"],
          },
        },
        ariaLabel: {
          label: "Aria Label",
          type: "text",
        },
        icon: {
          label: "Icon",
          type: "select",
          options: [
            { label: "LinkedIn", value: "linkedin" },
            { label: "Instagram", value: "instagram" },
            { label: "YouTube", value: "youtube" },
            { label: "Facebook", value: "facebook" },
            { label: "Pinterest", value: "pinterest" },
            { label: "Snapchat", value: "snapchat" },
            { label: "TikTok", value: "tiktok" },
            { label: "Yelp", value: "yelp" },
          ],
        },
      },
      defaultItemProps: {
        cta: createCtaField("Social", "#"),
        ariaLabel: "Social",
        icon: "linkedin",
      },
      getItemSummary: (item: SocialLink) =>
        item.ariaLabel ||
        (typeof item.cta.constantValue?.label === "string"
          ? item.cta.constantValue.label
          : item.cta.constantValue?.label?.defaultValue) ||
        item.cta.field ||
        "Social",
    },
  };

const IndividualPracticeFooterComponent: PuckComponent<IndividualPracticeFooterProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const navHeading =
      resolveComponentData(
        props.navHeading.text,
        locale,
        streamDocument,
      )?.toString() ?? "";
    const logoImage = resolveComponentData(
      props.logoImage.image,
      locale,
      streamDocument,
    ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
    const logoImageBorderRadius =
      props.logoImage.styles?.borderRadius === "default"
        ? undefined
        : props.logoImage.styles?.borderRadius;
    const address = resolveComponentData(props.address, locale, streamDocument);
    const phoneItems = (props.phone.items ?? [])
      .map((item) => {
        const resolvedNumber = resolveComponentData(
          item.number,
          locale,
          streamDocument,
        );
        const normalizedNumber =
          typeof resolvedNumber === "string" ? resolvedNumber.trim() : "";
        const normalizedLabel = item.label?.trim() ?? "";

        if (!normalizedNumber) {
          return null;
        }

        return {
          label: normalizedLabel,
          originalNumber: normalizedNumber,
          formattedNumber: formatPhoneNumber(
            normalizedNumber,
            props.phone.phoneFormat,
          ),
          telDigits: normalizedNumber.replace(/\D/g, ""),
          fieldId: item.number.field,
          constantValueEnabled: item.number.constantValueEnabled,
        };
      })
      .filter((item): item is ResolvedPhoneItem => item !== null);
    const resolvedNavLinks = (props.navLinks ?? [])
      .map((item, index) => {
        const resolved = resolveComponentData(
          item.cta,
          locale,
          streamDocument,
        ) as EnhancedTranslatableCTA | undefined;
        const label =
          typeof resolved?.label === "string"
            ? resolved.label
            : resolved?.label?.defaultValue ?? "";
        const link =
          typeof resolved?.link === "string"
            ? resolved.link
            : resolved?.link?.defaultValue ?? "";

        if (!label || !link) {
          return null;
        }

        return {
          key: `${label}-${index}`,
          label,
          link,
          linkType: resolved?.linkType ?? "URL",
          openInNewTab: resolved?.openInNewTab ?? false,
          entityField: item.cta,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
    const resolvedSocialLinks = (props.socialLinks ?? [])
      .map((item, index) => {
        const resolved = resolveComponentData(
          item.cta,
          locale,
          streamDocument,
        ) as EnhancedTranslatableCTA | undefined;
        const link =
          typeof resolved?.link === "string"
            ? resolved.link
            : resolved?.link?.defaultValue ?? "";

        if (!link) {
          return null;
        }

        return {
          key: `${item.ariaLabel}-${index}`,
          link,
          linkType: resolved?.linkType ?? "URL",
          openInNewTab: resolved?.openInNewTab ?? false,
          ariaLabel: item.ariaLabel,
          icon: item.icon,
          entityField: item.cta,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
    const sectionForeground = getThemeColorCssValue(
      props.section.backgroundColor.contrastingColor,
    );
    const sectionDivider = `1px solid color-mix(in srgb, ${sectionForeground} 18%, transparent)`;

    return (
      <VisibilityWrapper
        isEditing={props.puck.isEditing}
        liveVisibility={props.section.visibleOnLivePage}
      >
        <style>{`
          .yip-footer-root p {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-footer-root li {
            font-family: var(--fontFamily-body-fontFamily);
            font-size: var(--fontSize-body-fontSize);
            line-height: 1.5;
            font-weight: var(--fontWeight-body-fontWeight);
            font-style: var(--fontStyle-body-fontStyle);
            text-transform: var(--textTransform-body-textTransform);
          }

          .yip-footer-root h1 {
            font-family: var(--fontFamily-h1-fontFamily);
            font-size: var(--fontSize-h1-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h1-fontWeight);
            font-style: var(--fontStyle-h1-fontStyle);
            text-transform: var(--textTransform-h1-textTransform);
          }

          .yip-footer-root h2 {
            font-family: var(--fontFamily-h2-fontFamily);
            font-size: var(--fontSize-h2-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h2-fontWeight);
            font-style: var(--fontStyle-h2-fontStyle);
            text-transform: var(--textTransform-h2-textTransform);
          }

          .yip-footer-root h3 {
            font-family: var(--fontFamily-h3-fontFamily);
            font-size: var(--fontSize-h3-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h3-fontWeight);
            font-style: var(--fontStyle-h3-fontStyle);
            text-transform: var(--textTransform-h3-textTransform);
          }

          .yip-footer-root h4 {
            font-family: var(--fontFamily-h4-fontFamily);
            font-size: var(--fontSize-h4-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h4-fontWeight);
            font-style: var(--fontStyle-h4-fontStyle);
            text-transform: var(--textTransform-h4-textTransform);
          }

          .yip-footer-root h5 {
            font-family: var(--fontFamily-h5-fontFamily);
            font-size: var(--fontSize-h5-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h5-fontWeight);
            font-style: var(--fontStyle-h5-fontStyle);
            text-transform: var(--textTransform-h5-textTransform);
          }

          .yip-footer-root h6 {
            font-family: var(--fontFamily-h6-fontFamily);
            font-size: var(--fontSize-h6-fontSize);
            line-height: 1.2;
            font-weight: var(--fontWeight-h6-fontWeight);
            font-style: var(--fontStyle-h6-fontStyle);
            text-transform: var(--textTransform-h6-textTransform);
          }

          .yip-footer-root a.yip-footer-text-link,
          .yip-footer-root .yip-footer-rich-text a {
            font-family: var(--fontFamily-link-fontFamily);
            font-size: var(--fontSize-link-fontSize);
            font-weight: var(--fontWeight-link-fontWeight);
            font-style: var(--fontStyle-link-fontStyle);
            line-height: 1.5;
            text-decoration: none;
            text-transform: var(--textTransform-link-textTransform);
            letter-spacing: var(--letterSpacing-link-letterSpacing);
          }

          .yip-footer-root a.yip-footer-text-link:hover,
          .yip-footer-root a.yip-footer-text-link:focus-visible,
          .yip-footer-root .yip-footer-rich-text a:hover,
          .yip-footer-root .yip-footer-rich-text a:focus-visible {
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 0.18em;
          }

          @media (max-width: 64rem) {
            .yip-footer-top {
              gap: 1.5rem !important;
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 48rem) {
            .yip-footer-links {
              grid-template-columns: 1fr !important;
            }

            .yip-footer-bottom {
              align-items: flex-start !important;
              flex-direction: column;
              gap: 1rem !important;
            }
          }
        `}</style>
        <footer
          className="yip-footer-root"
          style={{
            backgroundColor: getThemeColorCssValue(props.section.backgroundColor),
            padding: "24px 0 48px",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: "min(100% - 2rem, 91rem)",
            }}
          >
            <div
              className="yip-footer-top"
              style={{
                alignItems: "start",
                display: "grid",
                gap: "clamp(2rem, 8vw, 9rem)",
                gridTemplateColumns: "minmax(8rem, 10rem) minmax(0, 1fr)",
              }}
            >
              {logoImage ? (
                <EntityField
                  displayName="Logo Image"
                  fieldId={props.logoImage.image.field}
                  constantValueEnabled={props.logoImage.image.constantValueEnabled}
                >
                  <div
                    style={{
                      aspectRatio:
                        props.logoImage.aspectRatio > 0
                          ? props.logoImage.aspectRatio
                          : undefined,
                      borderRadius: logoImageBorderRadius,
                      justifySelf: "start",
                      maxWidth: "100%",
                      minWidth: 0,
                      overflow:
                        props.logoImage.imageConstrain === "filled" ||
                        Boolean(logoImageBorderRadius)
                          ? "hidden"
                          : undefined,
                      width: "min(100%, 10rem)",
                    }}
                  >
                    <Image
                      image={logoImage}
                      className={
                        props.logoImage.aspectRatio > 0 ? "h-full" : undefined
                      }
                      style={{
                        display: "block",
                        height:
                          props.logoImage.aspectRatio > 0 ? "100%" : "auto",
                        objectFit:
                          props.logoImage.imageConstrain === "filled"
                            ? "cover"
                            : "contain",
                        width: "100%",
                      }}
                    />
                  </div>
                </EntityField>
              ) : null}
              <div style={{ display: "grid", gap: "24px" }}>
                <div
                  style={{
                    borderBottom: sectionDivider,
                    paddingBottom: "12px",
                  }}
                >
                  <EntityField
                    displayName="Navigation Heading"
                    fieldId={props.navHeading.text.field}
                    constantValueEnabled={props.navHeading.text.constantValueEnabled}
                  >
                    <h3
                      style={{
                        color: getThemeColorCssValue(
                          props.navHeading.fontColor ??
                            props.section.backgroundColor.contrastingColor,
                        ),
                        fontFamily:
                          props.navHeading.styles.fontFamily === "default"
                            ? undefined
                            : props.navHeading.styles.fontFamily,
                        fontSize:
                          props.navHeading.styles.fontSize === "default"
                            ? undefined
                            : props.navHeading.styles.fontSize,
                        fontStyle:
                          props.navHeading.styles.fontStyle === "default"
                            ? undefined
                            : props.navHeading.styles.fontStyle,
                        fontWeight:
                          props.navHeading.styles.fontWeight === "default"
                            ? undefined
                            : props.navHeading.styles.fontWeight,
                        margin: 0,
                        textTransform:
                          props.navHeading.styles.textTransform === "default"
                            ? undefined
                            : props.navHeading.styles.textTransform,
                      }}
                    >
                      {navHeading}
                    </h3>
                  </EntityField>
                </div>
                <div
                  className="yip-footer-links"
                  style={{
                    display: "grid",
                    gap: "16px 64px",
                    gridTemplateColumns: "repeat(2, minmax(0, max-content))",
                  }}
                >
                  {resolvedNavLinks.map((item, index) => (
                    <EntityField
                      key={item.key}
                      displayName="Navigation Link"
                      fieldId={item.entityField.field}
                      constantValueEnabled={
                        item.entityField.constantValueEnabled
                      }
                    >
                      <Link
                        cta={{
                          link: item.link,
                          linkType: item.linkType,
                        }}
                        eventName={`footerLink-${index}`}
                        className="yip-footer-text-link"
                        target={item.openInNewTab ? "_blank" : undefined}
                        rel={
                          item.openInNewTab ? "noopener noreferrer" : undefined
                        }
                      >
                        {item.label}
                      </Link>
                    </EntityField>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="yip-footer-bottom"
              style={{
                alignItems: "flex-end",
                borderTop: sectionDivider,
                display: "flex",
                gap: "24px",
                justifyContent: "space-between",
                marginTop: "48px",
                paddingTop: "24px",
              }}
            >
              <address
                style={{
                  color: sectionForeground,
                  fontStyle: "normal",
                }}
              >
                {address ? (
                  <EntityField
                    displayName="Address"
                    fieldId={props.address.field}
                    constantValueEnabled={props.address.constantValueEnabled}
                  >
                    <Address
                      address={address}
                      showRegion={props.showRegion}
                      showCountry={props.showCountry}
                    />
                  </EntityField>
                ) : null}
                {phoneItems.map((item, index) => {
                  const content = item.label
                    ? `${item.label} ${item.formattedNumber}`
                    : item.formattedNumber;

                  return (
                    <EntityField
                      key={`${item.label}-${item.originalNumber}`}
                      displayName="Phone Number"
                      fieldId={item.fieldId}
                      constantValueEnabled={item.constantValueEnabled}
                    >
                      <p style={{ margin: 0 }}>
                        {!props.phone.includeHyperlink || !item.telDigits ? (
                          content
                        ) : (
                          <Link
                            cta={{
                              link: item.telDigits,
                              linkType: "PHONE",
                            }}
                            eventName={`phone${index}`}
                            className="yip-footer-text-link"
                          >
                            {content}
                          </Link>
                        )}
                      </p>
                    </EntityField>
                  );
                })}
              </address>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                {resolvedSocialLinks.map((item, index) => {
                  const SocialIcon = socialIcons[item.icon];
                  return (
                    <EntityField
                      key={item.key}
                      displayName="Social Link"
                      fieldId={item.entityField.field}
                      constantValueEnabled={
                        item.entityField.constantValueEnabled
                      }
                    >
                      <Link
                        cta={{
                          link: item.link,
                          linkType: item.linkType,
                        }}
                        eventName={`socialLink-${index}`}
                        target={item.openInNewTab ? "_blank" : undefined}
                        rel={
                          item.openInNewTab ? "noopener noreferrer" : undefined
                        }
                        aria-label={item.ariaLabel}
                      >
                        <span
                          style={{
                            alignItems: "center",
                            display: "inline-flex",
                            justifyContent: "center",
                            width: "24px",
                          }}
                        >
                          <SocialIcon className="h-5 w-5" />
                        </span>
                      </Link>
                    </EntityField>
                  );
                })}
              </div>
            </div>
          </div>
        </footer>
      </VisibilityWrapper>
    );
  };

export const IndividualPracticeFooter: YextComponentConfig<IndividualPracticeFooterProps> =
  {
    label: "Footer",
    fields: IndividualPracticeFooterFields,
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      logoImage: createImageField(
        "https://a.mktgcdn.com/p/OLT2KExDEKhKlCmIobyRRHN6MFUS77fVs5gIt_FTnBI/450x450.jpg",
        450,
        450,
        1,
      ),
      navHeading: createTextField("Main Pages"),
      navLinks: [
        { cta: createCtaField("Specialties", "#specialties") },
        { cta: createCtaField("Providers", "#providers") },
        { cta: createCtaField("Insurance", "#insurance") },
        { cta: createCtaField("Patient Resources", "#resources") },
        { cta: createCtaField("Contact", "#contact") },
      ],
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
      phone: {
        items: [
          {
            number: {
              field: "mainPhone",
              constantValue: "",
              constantValueEnabled: false,
            },
            label: "",
          },
        ],
        phoneFormat: "domestic",
        includeHyperlink: true,
      },
      socialLinks: [
        {
          cta: createCtaField("Facebook", "#"),
          ariaLabel: "Facebook",
          icon: "facebook",
        },
        {
          cta: createCtaField("Instagram", "#"),
          ariaLabel: "Instagram",
          icon: "instagram",
        },
        {
          cta: createCtaField("Yelp", "#"),
          ariaLabel: "Yelp",
          icon: "yelp",
        },
      ],
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticeFooter${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticeFooterComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticeFooter",
  displayName: "Footer",
  description: "Footer",
  pageSetTypes: ["ENTITY", "DIRECTORY", "LOCATOR"],
};
