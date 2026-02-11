import type { Dispatch, SetStateAction } from "react";
import type { Content, EditableTextProps } from "../app/types";

type EditableTextComponent = (props: EditableTextProps) => React.ReactElement;

type AboutSectionProps = {
  content: Content;
  setContent: Dispatch<SetStateAction<Content>>;
  resolveText: (key: string, fallback: string) => string;
  updateOverride: (key: string, value: string) => void;
  displayEffectClass: string;
  labelEffectClass: string;
  bodyEffectClass: string;
  EditableText: EditableTextComponent;
};

const AboutSection = ({
  content,
  setContent,
  resolveText,
  updateOverride,
  displayEffectClass,
  labelEffectClass,
  bodyEffectClass,
  EditableText,
}: AboutSectionProps) => {
  return (
    <section id="about" className="mt-20 paper-card p-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <EditableText
            as="p"
            value={resolveText("section.about", "about")}
            onChange={(value) => updateOverride("section.about", value)}
            className={`font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--muted)] ${labelEffectClass}`}
          />
          <EditableText
            as="h3"
            value={content.aboutTitle}
            onChange={(value) =>
              setContent((prev) => ({ ...prev, aboutTitle: value }))
            }
            className={`font-display text-3xl ${displayEffectClass}`}
          />
          <EditableText
            as="p"
            value={content.aboutBody}
            onChange={(value) =>
              setContent((prev) => ({ ...prev, aboutBody: value }))
            }
            multiline
            className={`text-base text-[color:var(--ink)]/80 ${bodyEffectClass}`}
          />
        </div>
        <div className="space-y-3">
          <EditableText
            as="p"
            value={content.contactLabel}
            onChange={(value) =>
              setContent((prev) => ({ ...prev, contactLabel: value }))
            }
            className={`font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--olive)] ${labelEffectClass}`}
          />
          <EditableText
            as="p"
            value={content.contactText}
            onChange={(value) =>
              setContent((prev) => ({ ...prev, contactText: value }))
            }
            multiline
            className={`text-base text-[color:var(--ink)]/80 ${bodyEffectClass}`}
          />
          <a
            className="font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--ink)]"
            href={`mailto:${content.contactEmail}`}
          >
            <EditableText
              as="span"
              value={content.contactEmail}
              onChange={(value) =>
                setContent((prev) => ({ ...prev, contactEmail: value }))
              }
              className={labelEffectClass}
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
