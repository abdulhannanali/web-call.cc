---
description: >-
  This page will reflect the stage of Zen's development. It was last modified on
  11 September, 2021.
---

# Part 10: Zen Status Report

When I started thinking about Zen years ago, the base level motivations for it were:

1. A web page has a conceptually simple construction: boxes within boxes and boxes laid on top of other boxes. \(These features are common in computers’ desktop environments.\) Thus HTML and CSS scream out “Give me a visual DMI \(direct manipulation interface\) for adjusting my attributes like the HTML style attribute." \(See [http://bit.ly/HTML-attributes](http://bit.ly/HTML-attributes) and [https://mzl.la/3C0cazr](https://mzl.la/3C0cazr).\)
2. Why are web pages so static? Why can’t the height and width of any column or box be adjusted by dragging a mouse or finger? The new look of the page could be saved and associated with the user.
3. Why can’t new HTML elements be added to a web page? They could be attached anywhere in the DOM compatible with the HTML5 content models \(see [https://bit.ly/w3-content-models](https://bit.ly/w3-content-models)\), which tell which kind of content can be inserted into which kind of content.
4. Noticing the parallel between HTML and Lisp’s s-expressions, I realised Lisp \(and Scheme\) would be able to manipulate HTML easily if a Scheme interpreter were embedded in the web page. I found 3 such interpreters: [https://bluishcoder.co.nz/jsscheme/](https://bluishcoder.co.nz/jsscheme/), [https://www.biwascheme.org/](https://www.biwascheme.org/), and Gambit Scheme in JavaScript \(see [https://web-call.cc/gambit-in-javascript.html](https://web-call.cc/gambit-in-javascript.html) and [http://www.iro.umontreal.ca/~feeley/](http://www.iro.umontreal.ca/~feeley/)\).
5. Scheme has another wonderful feature: it can adopt any kind of syntax.

Later on I realised Scheme can provide an extremely useful piece for building tiny operating systems in client-side \(web browser\) programmes. This building block is the true continuation. No other programming language has anything like the Scheme continuation. Using Scheme continuations I created an operating system-like construct modelled after the Unix/POSIX/Linux select\(2\) and poll\(2\) system calls. \(See [https://man7.org/linux/man-pages/man2/select.2.html](https://man7.org/linux/man-pages/man2/select.2.html) and [https://man7.org/linux/man-pages/man2/poll.2.html](https://man7.org/linux/man-pages/man2/poll.2.html).\) This solves the twin problems of the stateless nature of the web and the event-driven nature of JavaScript-in-the-browser. It also makes the promise of simplifying web applications practical by moving the memory burden of stored continuations from the web server to the web browser, thus spreading out the burden across thousands or millions of computers. \(See [https://christian.queinnec.org/PDF/www.pdf](https://christian.queinnec.org/PDF/www.pdf).\)

**My main focus on Zen as of now:**

1. Get clarity and depth on what I want the alpha release of Zen to be. There are two aspects of this: \(1\) the Scheme functions and macros that Zen will provide and \(2\) the Zen framework’s default empty web page with its builtin HTML elements and interactions to allow the creation of single page web apps \(SPAs\).
2. Zen currently has no arrangement for a dilettante- or amateur-oriented REPL \(command line shell\), but HyperCard had a concept for attaching code either to a visible object in the application. Probably this 1987 HyperCard concept \(see [https://en.wikipedia.org/wiki/HyperCard](https://en.wikipedia.org/wiki/HyperCard)\) evolved from a SmallTalk environment. The concept was extremely successful. Many people like high school teachers used HyperCard to create hypermedia applications before the web existed. Zen could also allow code to be attached to a web page itself, not just an object in the page. IMPORTANT NOTE: For the near future Zen will only allow programmers to create web apps with it using the Scheme programming language. It is hard to create a visual programming language. \(See my beginning attempt at [https://web-call.cc/visual-programming.html](https://web-call.cc/visual-programming.html).\)
3. Nesting of with-handlers is untested. The ability to buffer and edit character line input will be highly useful to Zen applications because a **with-handlers** block \(see [https://doc.mashweb.club/experiments/seq\_webapp\_biwascheme/](https://doc.mashweb.club/experiments/seq_webapp_biwascheme/) and [https://web-call.cc/sequentially-programmed-web-apps.html](https://web-call.cc/sequentially-programmed-web-apps.html)\) should be able to accept either a single mouse click or a complete character string using a kind of _canonical mode_ or _cooked mode_ \(see [https://en.wikipedia.org/wiki/POSIX\_terminal\_interface\#History](https://en.wikipedia.org/wiki/POSIX_terminal_interface#History) and [https://en.wikipedia.org/wiki/Terminal\_mode](https://en.wikipedia.org/wiki/Terminal_mode)\) so the user can use backspace or delete and other characters to do simple line editing.
4. I have used only [BiwaScheme](https://www.biwascheme.org/) in my experiments using web continuations to create single page web apps. BiwaScheme seems not to handle [Scheme exception and condition restarts](https://www.scheme.com/tspl4/exceptions.html). This somewhat spoils a Scheme developer's experience. 



