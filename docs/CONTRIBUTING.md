# Contributing to VA Disability & Salary Calculator

Thank you for your interest in contributing to this project! This tool helps veterans and their families, and we welcome improvements.

## How to Contribute

### Reporting Issues
- Use the GitHub issue tracker
- Describe the bug or feature request clearly
- Include steps to reproduce (for bugs)
- Mention your browser and OS version

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Test thoroughly in multiple browsers
   - Ensure calculations remain accurate

4. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

### Code Guidelines

- **No Dependencies**: This is a vanilla JavaScript project
- **Browser Compatibility**: Test in Chrome, Firefox, and Safari
- **Accuracy First**: Tax and VA rates must be verified
- **Privacy**: All calculations must remain client-side
- **Accessibility**: Follow WCAG 2.1 AA standards

### Areas for Contribution

- **State Coverage**: Add more specific county/city tax mappings
- **Tax Data**: Update tax rates (with sources)
- **Features**: UI improvements, export functionality
- **Testing**: Add test cases for edge scenarios
- **Documentation**: Improve README or add examples

### Testing Checklist

Before submitting:
- [ ] Test with various VA ratings (0%, 30%, 70%, 100%)
- [ ] Test with different states and territories
- [ ] Verify tax calculations are accurate
- [ ] Check mobile responsiveness
- [ ] Ensure CSP compliance (no console errors)
- [ ] Test in multiple browsers

### Questions?

Open an issue for discussion or contact the maintainer on [LinkedIn](https://www.linkedin.com/in/dexcopeland/) or [GitHub](https://github.com/dexcopeland).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
