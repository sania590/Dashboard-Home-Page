# Frontend Development Task – Instructions

Welcome! Before you begin writing any code, **please carefully read this README** to understand the rules and expectations.

---

## 🚫 Files You MUST NOT Modify

The following files are **strictly off-limits** for modification. These have been pre-written and must remain unchanged:

- `donotchange.css`
- `category-manager.js`
- `donotchangescript.js`

Your edits should be limited to the following:

- **Styles** → `style.css`
- **JavaScript (optional/conditional logic)** → `script.js`

---

## 📚 Code Guidelines (Must Read Before You Start)

Please read the official code guidelines here **before making any changes**:

🔗 https://docs.google.com/document/d/1ND_pOAaFPbVVVIT_COofUH2DOZOasAPb4moiV-vc-ds/edit?usp=sharing


Your code will be **reviewed and judged** according to these standards.

---

##  Key Requirements & Best Practices

1. *** Mobile-First Styling**  
   Follow a mobile-first approach while writing styles in `style.css`.

2. *** JavaScript Logic**  
   - Do **not** write JS that runs on all pages directly in `script.js`.
   - JS code that is **specific to one HTML page** should go in that page’s `<script>` tag.
   - `script.js` should only contain **reusable or conditional code** that is needed globally.
   - avoid using OOPs

3. *** Dynamic & Static Data Versions**
You are required to deliver two versions of the page:

**Static Version** – Where the data is hardcoded directly into the HTML.
**Dynamic Version** – Where the data is rendered dynamically using JavaScript.

Mock data has already been added inside the **script** tag of the homepage. While the structure or content may not be 100% accurate, it gives a clear idea of how the data should be organized.

You are free to adjust the mock data as needed to suit the page design, but:

- Use no more than one variable (an array of objects or a single object) to manage all mock data.
- Do not create multiple scattered data blocks for the same section.

This will help ensure that once real data is fetched from the backend, integration remains seamless and efficient.



4. *** Write Clean Code**  
   - Use meaningful class names and indentation.
   - Add **clear comments** to explain your logic wherever necessary.
   - Avoid clutter, repetition, and unused code.

5. *** Color Variables (IMPORTANT)**  
   - **Do NOT create new color variables** in your CSS.  
   - Instead, check the Figma file and use the **exact variable names** that have already been defined in `donotchange.css`.  
   - If a color variable is not defined, use the **exact HEX code** (e.g., `#FDE2E1`) instead of creating a new variable.
---
## Committing and Pushing Your Code
Before submitting, make sure your work is saved and committed properly.

- git add .
- git commit -m "Your meaningful commit message here"
- git push

