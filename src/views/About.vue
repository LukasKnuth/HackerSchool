<template>
  <b-container class="about">
    <h1>Zutaten</h1>
    <h5>Wie wurde diese Seite eigentlich Programmiert?</h5>
    <p>Die Seite ist komplett in der Programmiersprache <a href="https://www.typescriptlang.org/">TypeScript</a> programmiert.</p>
    <p>Der gesamte Quellcode ist auf <a href="https://github.com/LukasKnuth/HackerSchool/">GitHub</a> verfügbar.</p>
    <p>Allerdings wurde nicht alles selbst erstellt, an vielen Stellen werden Software Bibliotheken verwendet, welche bestimmte Funktionen zur Verfügung stellen. Alle hier erwähnten Bibliotheken können kostenlos verwendet werden!</p>

    <h2>Der Editor</h2>
    <p>Der Editor basiert auf dem freien "Blockly" Projekt von Google. Der Editor kommt mit vielen coolen Features daher, z.B. die Arbeitsfläche zum Verschieben und Kombinieren der Blöcke oder die eingebauten "Rückgängig" und "Wiederherstellen" Funktionen.</p>
    <p>Von Haus aus bringt er zusätzlich viele wichtige Blöcke (z.B. "repeat" oder "if") mit. Die restlichen benötigten Blöcke (z.B. zum kontrollieren des Spiels) wurden von uns selbst hinzugefügt.</p>
    <p>Die Bibliothek ist unter <a href="https://developers.google.com/blockly/">developers.google.com/blockly</a> verfügbar.</p>

    <h2>Das Spiel</h2>
    <p>Um das Spiel zu rendern wurde die Game Engine "PixiJS" verwendet. Diese erlaubt es sehr einfach und unabhängig vom Browser auf Computern oder Tablets geometrische Objekte und Bilder auf einer Bühne zu platzieren und bewegen.</p>
    <p>Der Engine fehlen für größere Projekte einige Funktionen (z.B. eine Physics Engine), für unsere Levels reicht die Funktionalität allerdings föllig aus.</p>
    <p>Die Bibliothek ist unter <a href="http://www.pixijs.com/">PixiJS.com</a> verfügbar.</p>

    <h2>Alles Andere</h2>
    <p>Eine Webseite auf der viele interaktive Elemente leben, ist kompliziert zu bauen. Zusätzlich soll die Seite auch noch schnell reagiert und niemals neu laden müssen!</p>
    <p>Damit man sich darüber nicht selbst den Kopf zerbrechen muss, gibt es Bibliotheken die dabei helfen die komplizierten Teile schneller zu entwickeln. Sie helfen vor allem, wenn die Seite wächst, denn dann ist es oft schwer den Überblick zu behalten.</p>
    <p>Das Projekt ist unter <a href="https://vuejs.org/">VueJS.org</a> verfügbar.</p>
  </b-container>
</template>
