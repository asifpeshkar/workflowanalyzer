# 🧩 Workflow Analyzer

**Professional Workflow Log Analysis Tool** – A modern web application for parsing, analyzing, and visualizing workflow processing logs with intelligent pattern recognition.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-workflowanalyzer.vercel.app-blue?style=for-the-badge)](https://workflowanalyzer.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Source_Code-black?style=for-the-badge&logo=github)](https://github.com/asifpeshkar/workflowanalyzer)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://workflowanalyzer.vercel.app/)

## 🚀 **[Try it Live: workflowanalyzer.vercel.app](https://workflowanalyzer.vercel.app/)**

> **Ready to use right now!** No installation required – just open and start analyzing your workflow logs instantly.

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

## 💻 Development & Local Setup

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required!

### Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/asifpeshkar/workflowanalyzer.git
   cd workflowanalyzer
   ```

2. **Open in browser**:
   ```bash
   # Simply open index.html in your browser
   open index.html        # macOS
   start index.html       # Windows
   xdg-open index.html    # Linux
   ```

3. **Or use a local server**:
   ```bash
   # Python 3 (recommended)
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

## 🚀 Deployment

### ✅ **Already Deployed on Vercel**
This application is live and accessible at:
**[https://workflowanalyzer.vercel.app/](https://workflowanalyzer.vercel.app/)**

### 🔄 **Deploy Your Own Copy**
Want to deploy your own version? One-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/asifpeshkar/workflowanalyzer)

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

### 🔍 **Data Processing**
- **8+ Regex Patterns**: Maximum compatibility with different log formats
- **Smart Text Normalization**: Removes quotes, brackets, normalizes whitespace
- **Frequency Analysis**: Counts workflow/workstep combination occurrences
- **Descending Sort**: Results ordered by highest count first (most frequent on top)

### 🎨 **Visual Features**
- **Color-Coded Results**: High-frequency items highlighted in teal/green
- **Progress Bars**: Visual percentage indicators for each entry
- **Summary Statistics**: Total matches, unique workflows, unique worksteps
- **Real-Time Filtering**: Toggle low-frequency items without re-processing
- **Modern UI**: Gradient backgrounds, smooth animations, professional styling

### 📤 **Export & Integration**
- **CSV Export**: Excel-compatible downloads with full analysis data
- **Comprehensive Reports**: Includes metadata and processing statistics
- **Proper Data Escaping**: Handles special characters and formatting correctly
- **No Data Loss**: Client-side processing ensures complete privacy

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

## 📞 Support & Feedback

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/asifpeshkar/workflowanalyzer/issues)
- 💬 **Feature Requests**: [GitHub Discussions](https://github.com/asifpeshkar/workflowanalyzer/discussions)
- 📧 **Direct Contact**: Available through GitHub profile

## 🔗 Links & Resources

- **🌐 Live Application**: https://workflowanalyzer.vercel.app/
- **📚 Source Code**: https://github.com/asifpeshkar/workflowanalyzer
- **🐛 Report Issues**: https://github.com/asifpeshkar/workflowanalyzer/issues
- **💬 Discussions**: https://github.com/asifpeshkar/workflowanalyzer/discussions

## 🎯 **Get Started Right Now**

1. **Visit**: [workflowanalyzer.vercel.app](https://workflowanalyzer.vercel.app/)
2. **Upload** your workflow log file or paste log content
3. **Analyze** and get instant insights
4. **Export** results as CSV for further analysis

---

<div align="center">

### **[🚀 Launch Workflow Analyzer](https://workflowanalyzer.vercel.app/)**

**[⭐ Star this repo](https://github.com/asifpeshkar/workflowanalyzer)** if you find it useful!

**Built with ❤️ by [Asif Peshkar](https://github.com/asifpeshkar) @ Nexum Software**

Made with 🧩 for professional workflow analysis

</div>