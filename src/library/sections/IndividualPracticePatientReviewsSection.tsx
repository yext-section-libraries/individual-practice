import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  Background,
  EntityField,
  getAggregateRating,
  getAnalyticsScopeHash,
  getDefaultForegroundColor,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  getScopedTypographyStyles,
  lightTextStyles as defaultTextStyles,
  primaryColor,
  sectionField,
  whiteBackground,
} from "../shared/sectionHelpers";

type FirstPartyReview = {
  authorName?: string;
  rating?: number;
  content?: string;
  reviewDate?: string;
  comments?: Array<{
    content?: string;
    commentDate?: string;
  }>;
};

type ReviewAggregate = {
  publisher?: string;
  topReviews?: FirstPartyReview[];
};

type ReviewDocument = {
  ref_reviewsAgg?: ReviewAggregate[];
  locale?: string;
};

type IndividualPracticePatientReviewsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  cardBackgroundColor: ThemeColor;
  iconColor: ThemeColor;
};

const IndividualPracticePatientReviewsSectionFields: YextFields<IndividualPracticePatientReviewsSectionProps> =
  {
    section: sectionField,
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
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    iconColor: {
      label: "Quote and Star Color",
      type: "basicSelector",
      options: "SITE_COLOR",
    },
  };

const IndividualPracticePatientReviewsSectionComponent: PuckComponent<IndividualPracticePatientReviewsSectionProps> =
  (props) => {
    const streamDocument = useDocument<ReviewDocument>();
    const locale = streamDocument.locale ?? "en";
    const { averageRating, reviewCount } = getAggregateRating(streamDocument);
    const firstPartyAggregate = streamDocument.ref_reviewsAgg?.find(
      (item) => item.publisher === "FIRSTPARTY",
    );
    const reviews = firstPartyAggregate?.topReviews?.slice(0, 2) ?? [];
    const heading =
      resolveComponentData(props.heading.text, locale, streamDocument)?.toString() ??
      "";
    const sectionForeground = getThemeColorCssValue(
      props.section.backgroundColor.contrastingColor,
    );
    const cardForeground = getThemeColorCssValue(
      props.cardBackgroundColor.contrastingColor,
    );
    const cardIconForegroundColor = getDefaultForegroundColor(
      props.cardBackgroundColor,
      streamDocument,
    );
    const iconColor =
      !props.iconColor || props.iconColor.selectedColor === "default"
        ? getThemeColorCssValue(cardIconForegroundColor)
        : getThemeColorCssValue(props.iconColor);

    if (!reviews.length && !props.puck.isEditing) {
      return <></>;
    }

    return (
      <VisibilityWrapper
        isEditing={props.puck.isEditing}
        liveVisibility={props.section.visibleOnLivePage}
      >
        <style>{getScopedTypographyStyles("yip-patient-reviews-root")}</style>
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yip-patient-reviews-root px-4 py-pageSection-verticalPadding"
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: "min(100%, 52.5rem)",
            }}
          >
            <div
              style={{
                marginBottom: "32px",
                textAlign: "center",
              }}
            >
              {reviews.length ? (
                <p
                  style={{
                    color: sectionForeground,
                    margin: 0,
                  }}
                >
                  {`🌟 ${averageRating} stars from ${reviewCount} patient reviews`}
                </p>
              ) : null}
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
                    margin: "8px 0 0",
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
            {reviews.length ? (
              <div
                style={{
                  display: "grid",
                  gap: "28px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                }}
              >
                {reviews.map((review, index) => (
                  <blockquote
                    key={`${review.authorName ?? "review"}-${index}`}
                    style={{
                      ...getSurfaceColorStyle(
                        props.cardBackgroundColor,
                        streamDocument,
                      ),
                      borderRadius: "20px",
                      margin: 0,
                      padding: "32px",
                    }}
                  >
                    <div
                      style={{
                        color: iconColor,
                        fontSize: "2rem",
                        lineHeight: 1,
                        marginBottom: "18px",
                      }}
                    >
                      ❝
                    </div>
                    <p
                      style={{
                        color: cardForeground,
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {review.content ?? "No review content available."}
                    </p>
                    <footer style={{ marginTop: "24px" }}>
                      <cite
                        style={{
                          color: cardForeground,
                          display: "block",
                          fontStyle: "normal",
                        }}
                      >
                        {review.authorName ?? "Anonymous"}
                      </cite>
                      <span
                        style={{
                          color: iconColor,
                          display: "block",
                        }}
                      >
                        {typeof review.rating === "number" ? (
                          <>
                            {Array.from({ length: 5 }, (_, starIndex) =>
                              starIndex <
                              Math.min(5, Math.max(0, Math.round(review.rating ?? 0)))
                                ? "★"
                                : "☆",
                            ).join("")}
                            {` ${review.rating}/5`}
                          </>
                        ) : null}
                      </span>
                      {review.reviewDate ? (
                        <time
                          style={{
                            color: cardForeground,
                            display: "block",
                            marginTop: "8px",
                          }}
                        >
                          {new Date(review.reviewDate).toLocaleDateString(
                            streamDocument.locale ?? "en",
                          )}
                        </time>
                      ) : null}
                      {review.comments?.[0]?.content ? (
                        <p
                          style={{
                            color: cardForeground,
                            margin: "12px 0 0",
                          }}
                        >
                          {review.comments[0].content}
                        </p>
                      ) : null}
                    </footer>
                  </blockquote>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, textAlign: "center" }}>
                No first-party reviews available in the current document.
              </p>
            )}
          </div>
        </Background>
      </VisibilityWrapper>
    );
  };

export const IndividualPracticePatientReviewsSection: YextComponentConfig<IndividualPracticePatientReviewsSectionProps> =
  {
    label: "Patient Reviews Section",
    fields: IndividualPracticePatientReviewsSectionFields,
    defaultProps: {
      section: {
        backgroundColor: whiteBackground,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Patient Reviews",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
      },
      cardBackgroundColor: whiteBackground,
      iconColor: primaryColor,
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`IndividualPracticePatientReviewsSection${getAnalyticsScopeHash(props.id)}`}
      >
        <IndividualPracticePatientReviewsSectionComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "IndividualPracticePatientReviewsSection",
  displayName: "Patient Reviews Section",
  description: "Patient Reviews Section",
  pageSetTypes: ["ENTITY"],
};
