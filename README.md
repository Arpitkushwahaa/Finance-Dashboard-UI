# Finance Dashboard UI

A clean, interactive, and responsive finance dashboard interface built to evaluate frontend development skills. It demonstrates how to effectively design user interfaces, structure components, handle frontend data using modern state management, and create visually appealing visualizations.

## 🚀 Features

### Core Requirements Included:
1. **Dashboard Overview**: Highly descriptive summary cards displaying metrics (Total Balance, Income, Expenses) alongside a Time-based area chart (Balance Trend) and a Categorical breakdown pie chart.
2. **Transactions Section**: Displays user transactions with features to filter by transaction type (Income vs Expense), search by category name rapidly, and correctly adjust chronological vs. value-based sorting parameters.
3. **Role-Based UI Simulation**: A functional mocked Role-Based Access Control (RBAC) behavior system. The user can switch between "Viewer" and "Admin" using a navigation toggle. Only "Admin" users can access the creation of new transactions or deletion features.
4. **Insights Section**: An informative "Smart Insights" section providing an observational analysis based directly on localized application state logic (Highlighting the user's highest spending categorical percentage dynamically).
5. **State Management**: Leveraging the lightweight framework `Zustand` directly coupled to an encapsulated `store` folder structure correctly separating logic.

### 🔥 Optional Add-ons Engineered
*   **Data Persistence (Local Storage)**: All inputs, modifications, theme selections, and mock transactions interact naturally with Local Storage via Zustand's standard `persist` middleware, ensuring state is retained on reload!
*   **Dark Mode Integration**: Implemented a responsive multi-theme setup controlled via Tailwind configurations leveraging dynamic design tokens configured across a centralized CSS file for robust scaling.
*   **Export Functionality**: A native direct-to-device `.csv` generator and exporter accessible immediately inside the transactions panel!

## 🛠️ Stack Used

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) using a custom `index.css` tailored design system scaling tokens.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Charts / Visualizations**: [Recharts](https://recharts.org/en-US/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Date Parsing**: [Date-Fns](https://date-fns.org/)

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Arpitkushwahaa/Finance-Dashboard-UI.git
   cd Finance-Dashboard-UI
   ```

2. **Install dependencies:**
   Make sure you have Node installed, then run:
   ```bash
   npm install
   ```

3. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## 📐 General Approach

*   **Design First**: Initiated with structural design variables configuring light/dark schemas inside `globals.css` ensuring layout consistency via Tailwind `border`, `card`, `primary`, and `muted` semantic abstractions.
*   **Separation of Concerns**: Kept pure UI components encapsulated within `src/components` relying only on context supplied natively through `src/store/useStore.ts`.
*   **Simplicity**: Skipped overly complex configurations routing Redux boilerplates, implementing explicit state handling strictly limited to immediate evaluation concerns preserving readability.
