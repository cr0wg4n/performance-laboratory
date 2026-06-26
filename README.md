# Performance Laboratory
This repository contains a functional application that is intentionally designed to have poor web performance. The goal is to provide a hands-on learning experience for developers to identify and address performance issues in a real-world scenario.

## Requirements
- Node 24.XX or higher
- pnpm - I prefer pnpm over npm, but you can use npm if you want, check this [article](https://javascript.plainenglish.io/why-i-choose-pnpm-over-npm-every-time-a77283ae4d49?sharedUserId=cr0wg4n).
```
npm install -g pnpm
```


## Installation and Setup
Commands to setup the project:

- Web app
```bash
cd spa-app
pnpm install
```

- Server app
```bash
cd server-app
pnpm install
```

As the repository contains two separate applications, you will need to run both the web app and the server app, so locate in each folder and run the following command:

```bash
pnpm run dev
```

> Server runs at `http://localhost:3000` and the SPA runs at `http://localhost:5173`.


## Analyze bundle size
Run:
```bash
pnpm run bundle-check
```

## Analyze dependency graph
If you want to generate the svg image with the dependency graph of the SPA, you'll need to install `graphviz` in your system, you can check the installation instructions [here](https://graphviz.org/download/).

Run:
```bash
pnpm run dependency-check
pnpm run dependency-snapshot
```

## Non-important Notes
- http://localhost:5173/?page=1&limit=10
- http://localhost:5173/income?page=2&limit=20
- http://localhost:5173/outcome?page=3&limit=5
- http://localhost:5173/?limit=100000&page=1


## Poor Web Performance Skill
1. Don't remove event listeners when they are no longer needed, in component should not be destroyed, or when the component is unmounted. We want to introduce memory leaks and performance issues.
2. Use large data sets and complex computations in the main thread, blocking the UI and causing jank.
3. Avoid using caching or memoization techniques, forcing the application to recompute values unnecessarily.
4. Use inefficient algorithms or data structures that have poor time complexity, leading to slow performance.
5. Overuse global state management for local component state, causing unnecessary re-renders and performance bottlenecks.
6. Avoid using lazy loading or code splitting, forcing the entire application to load upfront and increasing initial load time.
7. Use large synchronous API calls or blocking operations, preventing the application from responding to user interactions in a timely manner.
8. Avoid using virtualization or pagination for large lists, rendering all items at once and causing performance issues.
9. Use excessive watchers or computed properties that trigger unnecessary re-renders, leading to performance degradation.
10. Avoid using performance optimization techniques like debouncing or throttling for user input events, causing excessive function calls and performance issues.
11. Avoid using clear and unique values for `key` attributes in template loops (independent of the web framework), leading to inefficient DOM updates and re-renders.
12. Use large images or media files without optimization, causing slow loading times and increased bandwidth usage.
13. Import as much components and code as possible in a single file, leading to larger bundle sizes and slower load times.
14. Bundle all in one file, avoiding code splitting and lazy loading.
15. Add DOM nodes without removing them when they are no longer needed.
16. Prefer sequential async calls instead of parallel async calls, leading to longer wait times for data fetching.
17. Always prefer non-tree-shakable libraries, increasing bundle size and load times.

## Aditional Resources
- https://pagespeed.web.dev/
- https://www.webpagetest.org/
- https://web.dev/articles/lcp
- https://web.dev/articles/inp
- https://web.dev/articles/cls
- [Web Performance Optimization](https://developer.mozilla.org/en-US/docs/Learn/Performance)
- https://www.youtube.com/watch?v=3haeDqv7Dzc
- https://www.youtube.com/watch?v=eiC58R16hb8
- https://www.debugbear.com/blog/speculation-rules