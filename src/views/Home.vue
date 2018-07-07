<template>
  <b-container>
    <b-row class="claim">
      <b-col>
        <h1>Programmieren - Einstieg leichtgemacht</h1>
        <p class="mantra"><b>Mantra:</b> Ein Computer macht immer genau das, was man ihm sagt, nicht mehr und nicht weniger.</p>
      </b-col>
    </b-row>
    <b-row class="info-block intro" align-h="center">
      <b-col cols="3">
        <font-awesome-icon icon="chalkboard-teacher" size="10x"/>
      </b-col>
      <b-col cols="6">
        <h2>Kurze Einführung</h2>
        <p>Zu Beginn des Kurses geben Eure Inspirer eine kurze Einführung zum Tool und allgemein zur Programmierung.</p>
        <p>Die Einleitung ist kurz und schmerzlos, damit ihr so schnell wie möglich loslegen könnt.</p>
      </b-col>
    </b-row>
    <b-row class="info-block pauses" align-h="center">
      <b-col cols="6">
        <h2>Pausen</h2>
        <p>Pausen könnt Ihr nach eigenem Ermessen nehmen.</p>
        <p>Wir werden den Kurs an einigen Stellen für ein paar Worte unterbrechen, das Ziel ist allerdings Unterbrechungen minimal zu halten.</p>
      </b-col>
      <b-col cols="3">
        <font-awesome-icon icon="pause" size="10x" />
      </b-col>
    </b-row>
    <b-row class="info-block start" align-h="center">
      <b-col cols="3">
        <font-awesome-icon icon="gamepad" size="10x" />
      </b-col>
      <b-col cols="6">
        <h2>Los gehts!</h2>
        <p>Es ist freies Arbeiten angesagt, ganz in Deinem Tempo! Bei Fragen stehen wir gerne für Hilfe und Anregungen bereit.</p>
        <p>Bring it on!</p>
        <b-button variant="success" to="/lessons">Zu den Kursen</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<style lang="scss">
  .claim {
    text-align: center;
    margin-top: 20px;

    .mantra {
      margin-top: 15px;
      font-size: 1.1em;
    }
  }
  .info-block {
    margin-top: 45px;
  }
</style>