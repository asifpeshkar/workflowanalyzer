# 🧩 Workflow Analyzer

**Nexum Automation Insights** – A modern web application for analyzing workflow log files and generating detailed workstep reports.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/workflow-analyzer)

## 🌐 Live Demo

**[Launch Workflow Analyzer](https://workflow-analyzer.vercel.app/)** _(Live link to be updated after deployment)_

## 📖 Overview

Workflow Analyzer is a client-side web application designed to parse and analyze log files from automation workflows. Built specifically for Nexum Software's automation insights, it helps teams understand workflow patterns, identify bottlenecks, and track workstep performance.

### ✨ Key Features

- 📁 **File Upload & Paste Support** – Upload `.log` or `.txt` files, or paste content directly
- 🔍 **Multi-Pattern Recognition** – Supports 7+ different log format patterns
- 📊 **Visual Analytics** – Interactive table with top performers highlighted
- 🎯 **Smart Filtering** – Toggle to hide items with fewer than 5 occurrences
- 📈 **Progress Visualization** – Percentage bars and count indicators
- 💾 **CSV Export** – Download comprehensive analysis reports
- 📱 **Responsive Design** – Works seamlessly on desktop, tablet, and mobile
- ⚡ **Client-Side Processing** – No server required, complete privacy
- 🎨 **Modern UI** – Gradient backgrounds, smooth animations, and professional styling

## 🚀 Supported Log Formats

The analyzer recognizes multiple workflow/workstep patterns:

```log
# Format Examples
Started workflow 'UserOnboarding' workstep 'ValidateEmail'
Processing workflow: DataProcessing | Step: ExtractData
Workflow [ReportGeneration] - Step [CompileData]
WF: OrderManagement, WS: CalculateTotal
DataPipeline.ExtractData
workflow: FileUpload workstep: VirusScan
"WorkflowName" "WorkstepName"
```

## 🛠️ How to Use

1. **Open the Application** – Visit the live demo or run locally
2. **Input Your Data**:
   - **Upload**: Drag & drop or click to select `.log` or `.txt` files
   - **Paste**: Copy log content directly into the textarea
3. **Analyze**: Click "Analyze Log" to process the data
4. **Filter** (Optional): Toggle "Hide items with < 5 occurrences"
5. **Export**: Download results as CSV for further analysis
6. **Reset**: Clear all data to start fresh

## 💻 Running Locally

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or server required!

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/workflow-analyzer.git
   cd workflow-analyzer
   ```

2. **Open in browser**:
   ```bash
   # Simply open index.html in your browser
   open index.html  # macOS
   start index.html # Windows
   xdg-open index.html # Linux
   ```

3. **Or use a local server** (optional):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```

## 🚀 Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/workflow-analyzer)

### Manual Deployment

1. **Fork this repository** to your GitHub account

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your forked repository

3. **Configure deployment**:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty
   - **Install Command**: Leave empty

4. **Deploy**: Click "Deploy" and your app will be live!

### Custom Domain (Optional)
1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Update the meta tags in `index.html` with your domain

## 📁 Project Structure

```
workflow-analyzer/
├── index.html          # Main application (HTML5, responsive)
├── script.js           # Core logic (vanilla JavaScript, no dependencies)
├── style.css           # Custom styles (Tailwind CSS enhancements)
├── manifest.json       # PWA manifest for app-like experience
├── favicon.svg         # App icon (WA logo with gradient)
├── sample-log.txt      # Example log file for testing
└── README.md           # This file
```

## 🔧 Technical Details

### Built With
- **HTML5** – Semantic markup and modern web standards
- **Tailwind CSS** – Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** – No frameworks, pure ES6+ code
- **PWA Features** – Manifest for app-like experience

### Performance Features
- ⚡ **Client-side processing** – No server round trips
- 🔒 **Complete privacy** – Data never leaves your browser
- 📱 **Progressive Web App** – Install on mobile devices
- ♿ **Accessible** – WCAG compliant, keyboard navigation
- 🌙 **Reduced motion support** – Respects user preferences

### Browser Compatibility
- ✅ Chrome/Chromium 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📊 Analysis Features

### Data Processing
- **Pattern Recognition**: 7 different regex patterns for maximum compatibility
- **Text Normalization**: Removes quotes, brackets, normalizes whitespace
- **Count Tracking**: Frequency analysis of workflow/workstep combinations
- **Sorting**: Results ordered by occurrence count (ascending)

### Visual Features
- **Top 3 Highlighting**: Most frequent combinations highlighted with 🏆
- **Progress Bars**: Visual percentage indicators
- **Summary Cards**: Total matches, unique workflows, unique worksteps
- **Interactive Filtering**: Real-time filter without re-processing

### Export Capabilities
- **CSV Format**: Excel-compatible export
- **Comprehensive Data**: Includes analysis metadata
- **Proper Escaping**: Handles special characters correctly

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit**: `git commit -m 'Add amazing feature'`
5. **Push**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Keep it simple – maintain the "no build tools" philosophy
- Test on multiple browsers and devices
- Follow accessibility best practices
- Update documentation for new features

## 📝 License

This project is proprietary software developed by **Nexum Software**.

## 👨‍💻 Credits

**Built with ❤️ by [Asif Peshkar](https://github.com/asifpeshkar) @ [Nexum Software](https://nexumsoftware.com)**

### Version History
- **v1.0 Beta** (Oct 2025) – Initial release with core analysis features
- **v1.1** (Coming Soon) – Time-based analysis and visualization charts

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/workflow-analyzer/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/workflow-analyzer/discussions)
- 📧 **Contact**: [asif@nexumsoftware.com](mailto:asif@nexumsoftware.com)

## 🔗 Links

- **Live Demo**: https://workflow-analyzer.vercel.app/
- **Repository**: https://github.com/your-username/workflow-analyzer
- **Nexum Software**: https://nexumsoftware.com

---

<div align="center">

**[⭐ Star this repo](https://github.com/your-username/workflow-analyzer)** if you find it useful!

Made with 🧩 for workflow automation insights

</div>