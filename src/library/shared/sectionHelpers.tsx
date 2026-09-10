import * as React from "react";
import type { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  MaybeRTF,
  getThemeColorCssValue,
  resolveComponentData,
  type MaybeRTFProps,
  type RichText,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

export type SectionProps = {
  backgroundColor: ThemeColor;
  visibleOnLivePage: boolean;
};

export type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  fontColor?: ThemeColor;
};

export const whiteBackground: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

export const primaryColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

export const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

export const lightTextStyles: StyledTextValue = {
  ...defaultTextStyles,
  fontWeight: "100",
};

export const sectionField: YextFields<{ section: SectionProps }>["section"] = {
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
};

/** Options formerly exposed by the Visual Editor as ThemeOptions.ASPECT_RATIO. */
export const aspectRatioOptions = [
  { label: "1:1", value: 1 },
  { label: "5:4", value: 1.25 },
  { label: "4:3", value: 1.33 },
  { label: "3:2", value: 1.5 },
  { label: "5:3", value: 1.67 },
  { label: "16:9", value: 1.78 },
  { label: "2:1", value: 2 },
  { label: "3:1", value: 3 },
  { label: "4:1", value: 4 },
  { label: "4:5", value: 0.8 },
  { label: "3:4", value: 0.75 },
  { label: "2:3", value: 0.67 },
];

export const createTextField = (
  defaultValue: string,
  field = "",
  constantValueEnabled = field.length === 0,
): YextEntityField<TranslatableString> => ({
  field,
  constantValue: {
    defaultValue,
    hasLocalizedValue: "true",
  },
  constantValueEnabled,
});

export const resolvePlainText = (
  value: YextEntityField<TranslatableString> | TranslatableString | undefined,
  locale: string,
  streamDocument: Record<string, unknown>,
): string =>
  resolveComponentData(value, locale, streamDocument, { output: "plainText" });

export const renderRichText = (
  value: unknown,
  richTextStyleOverrides?: MaybeRTFProps["richTextStyleOverrides"],
): React.ReactNode => {
  if (React.isValidElement(value)) {
    if (!richTextStyleOverrides) {
      return value;
    }

    return React.cloneElement(
      value as React.ReactElement<{ style?: React.CSSProperties }>,
      {
        style: {
          ...(value.props as { style?: React.CSSProperties }).style,
          ...richTextStyleOverrides,
          color: getThemeColorCssValue(richTextStyleOverrides.color),
        },
      },
    );
  }

  const data =
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "html" in value)
      ? (value as RichText | string)
      : undefined;

  return (
    <MaybeRTF
      data={data}
      richTextStyleOverrides={richTextStyleOverrides}
    />
  );
};

export const isRichTextEmpty = (value: unknown): boolean => {
  if (!value) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (typeof value === "object" && "html" in value) {
    const html = (value as { html?: unknown }).html;
    return typeof html !== "string" || html.trim() === "";
  }

  return false;
};

export const getImageData = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
): { src?: string; alt: string } => {
  if (!image || typeof image !== "object") {
    return { alt: "" };
  }

  const value = "image" in image && image.image ? image.image : image;
  return {
    src:
      "url" in value && typeof value.url === "string" && value.url.trim()
        ? value.url
        : undefined,
    alt:
      "alternateText" in value &&
      typeof value.alternateText === "string" &&
      value.alternateText.trim()
        ? value.alternateText
        : "",
  };
};

export const getScopedTypographyStyles = (scopeClass: string): string => `
  .${scopeClass} p,
  .${scopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  ${[1, 2, 3, 4, 5, 6]
    .map(
      (level) => `.${scopeClass} h${level} {
    font-family: var(--fontFamily-h${level}-fontFamily);
    font-size: var(--fontSize-h${level}-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h${level}-fontWeight);
    font-style: var(--fontStyle-h${level}-fontStyle);
    text-transform: var(--textTransform-h${level}-textTransform);
  }`,
    )
    .join("\n\n  ")}

  .${scopeClass} a:not(.font-button-fontFamily) {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
`;
