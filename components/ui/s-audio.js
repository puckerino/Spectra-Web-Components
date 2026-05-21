export default class SAudio extends HTMLElement {

  connectedCallback() {

    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const youtube =
      this.getAttribute("youtube") || "";

    const titulo =
      this.getAttribute("titulo") || "";

    const videoId =
      this.getVideoId(youtube);

    if (!videoId) {

      this.innerHTML = `
        <p>
          Video no válido
        </p>
      `;

      return;

    }

    this.innerHTML = `

      <style>

        s-audio {
          display: block;
        }

        s-audio .s-audio {

          display: flex;

          align-items: center;

          gap: var(--spacing);

          padding: var(--spacing);

          border:
            1px solid var(--mono-border1);

          border-radius:
            var(--br);

          background:
            var(--mono-surface2);

        }

        s-audio .s-audio-button {

          width: 3rem;
          height: 3rem;

          flex-shrink: 0;

          border:
            1px solid var(--mono-border1);

          border-radius:
            50%;

          background:
            var(--mono-component1);

          color:
            var(--mono-text1);

          cursor: pointer;

          display: grid;
          place-items: center;

          font-size: 1rem;

        }

        s-audio .s-audio-content {

          display: grid;

          gap: .25rem;

          min-width: 0;

          flex-grow: 1;

        }

        s-audio .s-audio-title {

          font:
            var(--f-m)
            var(--f-display-sans);

        }

        s-audio .s-audio-status {

          font:
            var(--f-s)
            var(--f-mono);

          text-transform:
            uppercase;

          color:
            var(--mono-text2);

        }

        s-audio iframe {

          width: 0;
          height: 0;

          border: 0;

          position: absolute;

          opacity: 0;

          pointer-events: none;

        }

      </style>

      <article class="s-audio">

        <button class="s-audio-button" type="button">

          <i class="bi bi-play-fill"></i>

        </button>

        <div class="s-audio-content">

          <div class="s-audio-title">

            ${titulo || "Audio"}

          </div>

          <div class="s-audio-status">

            detenido

          </div>

        </div>

        <iframe
          allow="autoplay"
          src="https://www.youtube.com/embed/${videoId}?enablejsapi=1"
        ></iframe>

      </article>

    `;

    this.button =
      this.querySelector(
        ".s-audio-button"
      );

    this.status =
      this.querySelector(
        ".s-audio-status"
      );

    this.iframe =
      this.querySelector("iframe");

    this.playing = false;

    this.button.addEventListener(
      "click",
      () => {

        this.toggle();

      }
    );

  }

  toggle() {

    if (!this.iframe.contentWindow)
      return;

    if (!this.playing) {

      this.iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "playVideo"
        }),
        "*"
      );

      this.playing = true;

      this.button.innerHTML = "❚❚";

      this.status.innerHTML =
        "reproduciendo";

    }

    else {

      this.iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "pauseVideo"
        }),
        "*"
      );

      this.playing = false;

      this.button.innerHTML = "▶";

      this.status.innerHTML =
        "detenido";

    }

  }

  getVideoId(url) {

    if (
      /^[a-zA-Z0-9_-]{11}$/.test(url)
    ) {

      return url;

    }

    try {

      const parsed =
        new URL(url);

      if (
        parsed.hostname.includes(
          "youtube.com"
        )
      ) {

        return parsed.searchParams.get("v");

      }

      if (
        parsed.hostname.includes(
          "youtu.be"
        )
      ) {

        return parsed.pathname.replace(
          "/",
          ""
        );

      }

    }

    catch (err) {}

    return "";

  }

}
