# Expense Tracker

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS. Track your personal finances with an intuitive interface, comprehensive analytics, and powerful filtering capabilities.

## Features

### Core Functionality
- **Add Expenses**: Quick and easy expense entry with date, amount, category, and description
- **Edit & Delete**: Modify or remove expenses with a clean modal interface
- **Data Persistence**: All data is automatically saved to localStorage
- **Form Validation**: Ensures data integrity with real-time validation feedback

### Analytics & Insights
- **Dashboard Overview**: View total spending, monthly totals, average expenses, and top categories at a glance
- **Category Breakdown**: Visual chart showing spending distribution across all categories
- **Summary Cards**: Key metrics displayed in beautiful, informative cards
- **Top Categories Page**: Dedicated analytics page with category rankings, time period filtering, and spending insights
- **Top Vendors Page**: Track spending by vendor/merchant with aggregation, sorting, and detailed statistics

### Filtering & Search
- **Date Range Filter**: View expenses within specific date ranges
- **Category Filter**: Focus on specific expense categories
- **Search**: Find expenses by description or category name
- **Dynamic Results**: Real-time filtering with result counts

### Categories
- Food
- Transportation
- Entertainment
- Shopping
- Bills
- Other

### Export & Data Management
- **CSV Export**: Download your filtered expenses as a CSV file for external analysis
- **Vendor Tracking**: Optional vendor field to track where money is spent
- **Backward Compatible**: All new features work seamlessly with existing data

### Design
- Modern, clean interface with professional styling
- Fully responsive design (works on desktop, tablet, and mobile)
- Smooth transitions and hover effects
- Loading states and visual feedback
- Accessible color scheme with category-specific colors

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Navigate to the project directory:
```bash
cd expense-tracker-ai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## How to Use

### Adding an Expense
1. Fill out the form on the left side of the dashboard:
   - Select the date (defaults to today)
   - Enter the amount in dollars
   - Choose a category from the dropdown
   - Add a description
2. Click "Add Expense"
3. Your expense will appear in the list and all analytics will update automatically

### Editing an Expense
1. Find the expense in the list
2. Click the "Edit" button
3. Modify the details in the modal that appears
4. Click "Update Expense" to save changes

### Deleting an Expense
1. Find the expense in the list
2. Click the "Delete" button
3. Confirm the deletion in the dialog

### Filtering Expenses
1. Use the filters section to narrow down your expenses:
   - Set a start date and/or end date
   - Select a specific category or choose "All"
   - Type in the search box to find specific expenses
2. Click "Clear Filters" to reset all filters

### Exporting Data
1. Apply any filters you want (or leave them clear for all expenses)
2. Click the "Export CSV" button in the header
3. A CSV file will download with your filtered expenses

### Viewing Top Categories
1. Click the "Top Categories" button in the header
2. View your expenses grouped by category with rankings
3. Use time period filters (All Time, This Month, This Quarter, This Year)
4. Adjust display limits to show top 3, 5, or all categories
5. Review insights about your spending patterns

### Viewing Top Vendors
1. Click the "Top Vendors" button in the header
2. View your expenses grouped by vendor/merchant
3. Sort by total amount, transaction count, or average per transaction
4. Adjust display limits to show top 5, 10, 20, 50, or all vendors
5. See which categories you spend at each vendor

## Project Structure

```
expense-tracker-ai/
├── app/
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Main application page
│   ├── top-categories/
│   │   └── page.tsx             # Top Categories analytics page
│   ├── top-vendors/
│   │   └── page.tsx             # Top Vendors analytics page
│   └── globals.css              # Global styles
├── components/
│   ├── ExpenseForm.tsx          # Form for adding/editing expenses
│   ├── ExpenseList.tsx          # List container for expenses
│   ├── ExpenseItem.tsx          # Individual expense display
│   ├── ExpenseFilters.tsx       # Filter controls
│   ├── SummaryCard.tsx          # Dashboard summary cards
│   ├── CategoryChart.tsx        # Category spending visualization
│   ├── TopCategoryCard.tsx      # Category statistics card
│   ├── VendorCard.tsx           # Vendor statistics card
│   └── Modal.tsx                # Reusable modal component
├── lib/
│   ├── storage.ts               # localStorage utilities
│   ├── utils.ts                 # Helper functions and calculations
│   └── category-utils.ts        # Category aggregation utilities
├── types/
│   ├── expense.ts               # TypeScript type definitions
│   └── category-stats.ts        # Category statistics types
└── public/                      # Static assets
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management with useState and useEffect
- **localStorage**: Client-side data persistence

## Key Features Explained

### Data Persistence
All expense data is stored in your browser's localStorage, which means:
- Data persists between sessions
- No backend or database required
- Data is private to your browser
- Works offline

### Responsive Design
The application is fully responsive with breakpoints for:
- Mobile devices (< 768px)
- Tablets (768px - 1024px)
- Desktop (> 1024px)

### Form Validation
- Date is required
- Amount must be greater than 0
- Description is required
- Real-time error messages

### Calculations
- Total spending across all filtered expenses
- Monthly total (current month only)
- Average expense amount
- Category-wise breakdown
- Top spending category

## Browser Support

Works in all modern browsers that support:
- ES6+
- localStorage
- CSS Grid and Flexbox

Recommended browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features for future versions:
- Multiple currency support
- Recurring expenses
- Budget setting and tracking
- Income tracking
- Advanced charts (line graphs, pie charts)
- Dark mode
- Cloud sync
- Import from CSV
- Receipt photo upload
- Tags/labels for expenses
- Multi-user support

## License

This is a demo application created for personal finance tracking.

## Support

If you encounter any issues or have questions:
1. Check that you're using a modern browser
2. Clear your browser cache and localStorage
3. Ensure JavaScript is enabled
4. Try the application in incognito/private mode

---

Built with Next.js 14, TypeScript, and Tailwind CSS
