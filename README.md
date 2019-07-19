# Proof of Concept zur Arbeit »Hintergrund und Funktionsweise virtueller DOMs«

Der Quelltext der PoC-Implementierung befindet sich im Unterverzeichnis `src`.

Der Quelltext einer beispielhafte Umsetzung einer Todo-Liste findet sich im Unterverzeichnis `example`. Diese kann unter [`https://hpi-vdom.netlify.com/example`](https://hpi-vdom.netlify.com/example) aufgerufen werden. Alternativ kann die Anwendung auch lokal aufgerufen werden.

Hierbei bitte beachten, dass die Anwendung mit ES6-Modulen strukturiert ist, deshalb in einem modernen Webbrowser ausgeführt und über einen Webserver (nicht über das Dateisystem) ausgeliefert werden muss. Dies ist auf einem Rechner mit einer aktuellen Node.js-Version beispielsweise leicht mithilfe des Moduls [`serve`](https://www.npmjs.com/package/serve) möglich:

```
npx serve -p 1234
```

Die Anwendung kann anschließend unter [`http://localhost:1234/example`](http://localhost:1234/example) aufgerufen werden.
