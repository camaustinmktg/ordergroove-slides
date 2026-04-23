# Ordergroove Slides

A Claude skill for generating on-brand Ordergroove PowerPoint decks with the correct fonts, colors, layouts, and brand assets built in.

Give Claude a topic, outline, rough bullets, or a deck idea, and it returns a `.pptx` that looks like it came from the Ordergroove brand system.

---

## What it does

Use this skill when you need to create a new Ordergroove presentation without starting from scratch.

Good use cases:

- Pitch decks and sales presentations
- QBRs and customer reviews
- Internal updates and all-hands decks
- Webinar or conference presentations
- One-pagers or case studies in slide form
- Fast-turnaround deck requests

---

## What's included

Out of the box, the skill handles:

- **21 built-in slide layouts** for common deck needs like title slides, agendas, content slides, charts, testimonials, case studies, and closing slides
- **Brand-correct colors**, including Midnight, Green, Groovy Green, and the supporting secondary palette
- **Figtree fonts**, with all required weights bundled in
- **Brand assets**, including logo variants, backgrounds, footer strip, gradient cards, and testimonial elements
- **Automatic accent-color logic**, so Green is used on light backgrounds and Groovy Green is used on dark ones
- **Visual QA**, including slide-by-slide inspection before the final file is returned

---

## Installation

The skill is added through the Cowork **Customize** menu, and from that point on Claude handles everything.

### Step-by-step

1. **Open Cowork** on your computer.
2. **Click the Customize button** in the Cowork interface. (It's the menu where you manage your plugins and skills.)
3. **Go to the Plugins / Skills section.** You should see a list of installed plugins and an option to browse or add new ones.
4. **Search for `ordergroove-slides`** (or browse for it by name if search isn't available).
5. **Click Install / Add.** Cowork will pull the skill into your plugins folder.
6. **Restart or refresh the conversation** if Cowork prompts you to. Some skills need a fresh session to register.
7. **Confirm it's loaded** by starting a new conversation and typing:

   ```text
   /ordergroove-slides
   ```

   If the slash-command autocomplete shows `ordergroove-slides` in the list, you're ready to go. You can also just ask Claude: *"what skills do you have?"* and it should list `ordergroove-slides`.

### What happens after installation

Claude takes care of:

- Loading brand assets (logos, backgrounds, footer, gradient cards)
- Installing Figtree fonts on first use
- Applying the correct layouts
- Running the visual QA pass

You will never need to open a terminal, install a font manually, or run a script.

---

## How to use it

In Cowork, start your request with:

```text
/ordergroove-slides <what you want>
```

### Example prompts

- `/ordergroove-slides build me a 5-slide QBR deck for Acme Brands — cover, agenda, three performance stats, closing`
- `/ordergroove-slides make a pitch deck for a skincare DTC prospect with a title slide, problem slide, solution slide, two case studies, and a close`
- `/ordergroove-slides turn these all-hands bullets into a deck: [paste bullets]`
- `/ordergroove-slides create a testimonial slide using these three customer quotes: [paste quotes]`
- `/ordergroove-slides make a chart slide comparing 2024 vs 2025 subscription revenue with these numbers: ...`

Once the skill is active in the conversation, you can keep iterating without repeating the slash command. For example:

- `Redo slide 3 as a two-column layout with a pull quote`

### Tips for better results

- **Provide the raw content.** Specific headlines, bullets, stats, and quotes give Claude more to work with.
- **Say who the deck is for.** Audience context helps Claude choose the right structure and tone.
- **Mention the client when relevant.** For co-branded decks, Claude can use the title slide logo box appropriately.
- **Iterate slide by slide.** Follow-up edits work well after the first pass.
- **Don't over-specify design details.** The skill already handles brand styling and layout rules.

### What you get back

Claude returns a `.pptx` file saved to the output folder. You can then open it in PowerPoint or upload it to Google Slides for final edits.

> **Note on preview rendering:** Some quick-preview tools may show the wrong font because they don't have Figtree installed. This is usually a preview issue, not a deck issue. Check the file in PowerPoint or Google Slides before assuming anything needs to be fixed.

---

## Brand rules the skill enforces

The skill is intentionally opinionated so decks stay on-brand.

**Typography**

- Figtree only
- Available weights: Regular, Medium, SemiBold, Bold, ExtraBold

**Color**

- Midnight (`#17132F`) instead of black for text
- Green (`#009A50`) on light backgrounds
- Groovy Green (`#00FF85`) on dark backgrounds
- Gray-900 (`#EBEAF0`) for subtitles on dark slides

**Layout**

- 16:9 widescreen format
- Footer strip on every slide
- Logo only on title and closing slides
- Section labels are all caps, bold, and tracked
- Body copy and headline spacing are standardized

**Iconography**

- Google Material Symbols Outlined only

**Charts**

- Solid brand colors only
- No gradient-filled charts

**Quotes and callouts**

- `quotation.png` is reserved for customer testimonial slides
- Strategic insights use a Midnight card with green accent styling instead


## QA before delivery

Before the deck is returned, the skill runs a visual QA pass:

1. Converts the deck to PDF
2. Splits the PDF into slide images
3. Checks for issues like:
   - text overflow
   - overlapping elements
   - incorrect accent colors
   - logo misuse
   - missing footer
   - placeholder text

---

## What's in the skill folder

For reference, the skill includes:

- `SKILL.md` — main instructions Claude follows
- `references/brand-constants.md` — palette, typography, and brand rules
- `references/layout-recipes.md` — the slide layout library
- `scripts/build.js` — shared helpers for layout and styling logic
- `scripts/install-fonts.sh` — font installation script
- `assets/brand/` — fonts, logos, backgrounds, footer, cards, and other brand assets

You don't need to touch any of these. Claude reads and runs them as needed.

---

## Questions or bugs

For help, reach out to Cameron Austin. 
