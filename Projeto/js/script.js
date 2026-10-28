
/* ==========================================================================
   utils.js
   ========================================================================== */

/* Fruuly — funções utilitárias compartilhadas (sem acesso ao DOM ao carregar). */
const Utils = (() => {
  function formatTime(sec) {
    if (sec == null || !isFinite(sec) || sec < 0) return "0:00";
    const total = Math.floor(sec);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = String(total % 60).padStart(2, "0");
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
  }

  function formatDuration(sec) {
    const minutes = Math.max(1, Math.round((sec || 0) / 60));
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    return m ? `${h} h ${m} min` : `${h} h`;
  }

  // FNV-1a de 32 bits: rápido e estável para gerar cores a partir de nomes.
  function hashString(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  function coverColors(seed) {
    const h = hashString(String(seed));
    const hue = h % 360;
    const hue2 = (hue + 25 + ((h >> 9) % 50)) % 360;
    return {
      from: `hsl(${hue} 70% 42%)`,
      to: `hsl(${hue2} 75% 22%)`,
    };
  }

  function greeting(hour) {
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  function normalize(str) {
    return String(str ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
  }

  function slug(str) {
    return normalize(str).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function isAudioFile(file) {
    if (file.type && file.type.startsWith("audio/")) return true;
    return /\.mp3$/i.test(file.name || "");
  }

  function baseName(fileName) {
    return String(fileName).replace(/\.[^.]+$/, "").replace(/_/g, " ").trim();
  }

  function escape(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const ICONS = {
    home: "M12 3 2.5 11.2l1.3 1.5L5 11.7V21h5.5v-6h3v6H19v-9.3l1.2 1 1.3-1.5L12 3Zm5 16h-1.5v-6h-7v6H7v-9l5-4.3 5 4.3v9Z",
    search: "M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4.8 4.8-1.4 1.4-4.8-4.8A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z",
    library: "M4 3h2v18H4V3Zm5 0h2v18H9V3Zm4.7.6 1.9-.6 5.4 17.2-1.9.6L13.7 3.6Z",
    plus: "M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z",
    play: "M7 4.5v15a.8.8 0 0 0 1.2.7l12-7.5a.8.8 0 0 0 0-1.4l-12-7.5A.8.8 0 0 0 7 4.5Z",
    pause: "M6 4h4v16H6V4Zm8 0h4v16h-4V4Z",
    prev: "M6 5h2v14H6V5Zm3.5 7 9.5 6.5v-13L9.5 12Z",
    next: "M16 5h2v14h-2V5ZM5 18.5 14.5 12 5 5.5v13Z",
    shuffle: "M16 4h4v4l-1.4-1.4-3.7 3.7-1.4-1.4 3.7-3.7L16 4ZM4 6h3.6l10.9 10.9L20 15.4V20h-4.6l1.6-1.6L6.8 8H4V6Zm5.4 7.2 1.4 1.4L6.8 18H4v-2h2l3.4-2.8Z",
    repeat: "M7 7h10V4l4 4-4 4V9H7v4H5V9a2 2 0 0 1 2-2Zm10 10H7v3l-4-4 4-4v3h10v-4h2v4a2 2 0 0 1-2 2Z",
    "repeat-one": "M7 7h10V4l4 4-4 4V9H7v4H5V9a2 2 0 0 1 2-2Zm10 10H7v3l-4-4 4-4v3h10v-4h2v4a2 2 0 0 1-2 2Zm-5.8-7.5H13v5h-1.5v-3.3l-.9.4-.4-1.2 1-.9Z",
    heart: "M12 20.7 10.6 19.4C5.4 14.7 2 11.6 2 7.8 2 4.7 4.4 2.3 7.5 2.3c1.7 0 3.4.8 4.5 2.1a6 6 0 0 1 4.5-2.1c3.1 0 5.5 2.4 5.5 5.5 0 3.8-3.4 6.9-8.6 11.6L12 20.7ZM7.5 4.3C5.5 4.3 4 5.8 4 7.8c0 2.9 3.1 5.7 7.8 10l.2.2.2-.2c4.7-4.3 7.8-7.1 7.8-10 0-2-1.5-3.5-3.5-3.5-1.5 0-3 1-3.6 2.4h-1.8C10.5 5.3 9 4.3 7.5 4.3Z",
    "heart-filled": "M12 20.7 10.6 19.4C5.4 14.7 2 11.6 2 7.8 2 4.7 4.4 2.3 7.5 2.3c1.7 0 3.4.8 4.5 2.1a6 6 0 0 1 4.5-2.1c3.1 0 5.5 2.4 5.5 5.5 0 3.8-3.4 6.9-8.6 11.6L12 20.7Z",
    volume: "M3 9h4l5-4v14l-5-4H3V9Zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4ZM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z",
    "volume-mute": "M3 9h4l5-4v14l-5-4H3V9Zm13.6.2 1.4-1.4 2.2 2.2 2.2-2.2 1.4 1.4-2.2 2.2 2.2 2.2-1.4 1.4-2.2-2.2-2.2 2.2-1.4-1.4 2.2-2.2-2.2-2.2Z",
    more: "M5 10.2a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Zm7 0a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Zm7 0a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Z",
    "chevron-down": "m5.6 8.6 6.4 6.4 6.4-6.4L19.8 10 12 17.8 4.2 10l1.4-1.4Z",
    "chevron-left": "M15.4 4.2 16.8 5.6 10.4 12l6.4 6.4-1.4 1.4L7.6 12l7.8-7.8Z",
    music: "M9 18.5V6.2L20 4v11.5a3 3 0 1 1-2-2.8V6.4l-7 1.4v10.7a3 3 0 1 1-2-2.8v2.8Z",
    folder: "M3 5h7l2 2h9v12H3V5Zm2 4v8h14V9H5Z",
    close: "M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6 10.6 12 5 6.4 6.4 5Z",
    disc: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
    edit: "M4 17.2V20h2.8L17 9.8 14.2 7 4 17.2ZM19.7 7.1a1 1 0 0 0 0-1.4l-1.4-1.4a1 1 0 0 0-1.4 0l-1.3 1.3 2.8 2.8 1.3-1.3Z",
    trash: "M8 3h8l1 2h4v2H3V5h4l1-2Zm-2 6h12l-1 12H7L6 9Zm2.2 2 .7 8h6.2l.7-8H8.2Z",
    user: "M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 8.5c4.4 0 8 2.2 8 5V21H4v-2.5c0-2.8 3.6-5 8-5Zm0 2c-3.3 0-5.6 1.5-6 3h12c-.4-1.5-2.7-3-6-3Z",
    upload: "M11 16V7.8L7.4 11.4 6 10l6-6 6 6-1.4 1.4L13 7.8V16h-2Zm-7 2h16v2H4v-2Z",
  };

  function icon(name, size = 24) {
    const d = ICONS[name];
    if (!d) return "";
    return `<svg class="icon icon-${name}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
  }

  // Atalho para criar elementos: el("button", { class: "x", onclick: fn }, "texto", outroEl)
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value == null || value === false) continue;
      if (key === "class") node.className = value;
      else if (key === "html") node.innerHTML = value;
      else if (key === "dataset") Object.assign(node.dataset, value);
      else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
      else if (value === true) node.setAttribute(key, "");
      else node.setAttribute(key, value);
    }
    for (const child of children.flat()) {
      if (child == null || child === false) continue;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  return {
    formatTime,
    formatDuration,
    hashString,
    coverColors,
    greeting,
    normalize,
    slug,
    isAudioFile,
    baseName,
    escape,
    icon,
    el,
  };
})();

/* ==========================================================================
   id3.js
   ========================================================================== */

/* Fruuly — leitura das tags ID3 (v1, v2.2, v2.3, v2.4) direto dos bytes do MP3. */
const ID3 = (() => {
  const empty = () => ({ title: null, artist: null, album: null, year: null, track: null, picture: null });

  const TEXT_FRAMES = {
    TIT2: "title", TT2: "title",
    TPE1: "artist", TP1: "artist",
    TALB: "album", TAL: "album",
    TYER: "year", TYE: "year", TDRC: "year",
    TRCK: "track", TRK: "track",
  };

  const latin1Decoder = new TextDecoder("latin1");
  const utf8Decoder = new TextDecoder("utf-8");

  function decodeUtf16(bytes, bigEndian) {
    let start = 0;
    if (bytes[0] === 0xfe && bytes[1] === 0xff) { bigEndian = true; start = 2; }
    else if (bytes[0] === 0xff && bytes[1] === 0xfe) { bigEndian = false; start = 2; }
    let out = "";
    for (let i = start; i + 1 < bytes.length; i += 2) {
      out += String.fromCharCode(bigEndian ? (bytes[i] << 8) | bytes[i + 1] : bytes[i] | (bytes[i + 1] << 8));
    }
    return out;
  }

  function decodeText(encoding, bytes) {
    let text;
    if (encoding === 1) text = decodeUtf16(bytes, false);
    else if (encoding === 2) text = decodeUtf16(bytes, true);
    else if (encoding === 3) text = utf8Decoder.decode(bytes);
    else text = latin1Decoder.decode(bytes);
    // v2.4 permite vários valores separados por \0: fica com o primeiro.
    return text.split("\0")[0].trim();
  }

  // Posição logo após o terminador de uma string (1 byte \0, ou 2 bytes alinhados em UTF-16).
  function skipString(bytes, pos, encoding) {
    if (encoding === 1 || encoding === 2) {
      while (pos + 1 < bytes.length && (bytes[pos] !== 0 || bytes[pos + 1] !== 0)) pos += 2;
      return pos + 2;
    }
    while (pos < bytes.length && bytes[pos] !== 0) pos++;
    return pos + 1;
  }

  function parsePicture(data, isV22) {
    const encoding = data[0];
    let pos = 1;
    let mime;
    if (isV22) {
      const fmt = latin1Decoder.decode(data.subarray(1, 4)).toLowerCase();
      mime = fmt === "png" ? "image/png" : "image/jpeg";
      pos = 4;
    } else {
      const end = skipString(data, pos, 0);
      mime = latin1Decoder.decode(data.subarray(pos, end - 1)).toLowerCase() || "image/jpeg";
      if (!mime.includes("/")) mime = `image/${mime === "jpg" ? "jpeg" : mime}`;
      pos = end;
    }
    const type = data[pos];
    pos = skipString(data, pos + 1, encoding);
    if (pos >= data.length) return null;
    return { type, mime, data: data.slice(pos) };
  }

  const syncsafe = (b, i) => (b[i] << 21) | (b[i + 1] << 14) | (b[i + 2] << 7) | b[i + 3];
  const be32 = (b, i) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;

  function removeUnsync(bytes) {
    const out = [];
    for (let i = 0; i < bytes.length; i++) {
      out.push(bytes[i]);
      if (bytes[i] === 0xff && bytes[i + 1] === 0x00) i++;
    }
    return Uint8Array.from(out);
  }

  function parseV2(bytes, out) {
    if (bytes.length < 10 || bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return;
    const major = bytes[3];
    if (major < 2 || major > 4) return;
    const flags = bytes[5];
    const size = syncsafe(bytes, 6);
    let tag = bytes.subarray(10, Math.min(10 + size, bytes.length));
    if (flags & 0x80 && major < 4) tag = removeUnsync(tag);

    let pos = 0;
    if (flags & 0x40 && major >= 3 && tag.length >= 4) {
      pos = major === 4 ? syncsafe(tag, 0) : be32(tag, 0) + 4;
    }

    const isV22 = major === 2;
    const headerSize = isV22 ? 6 : 10;
    let picture = null;

    while (pos + headerSize <= tag.length) {
      if (tag[pos] === 0) break; // início do padding
      const id = latin1Decoder.decode(tag.subarray(pos, pos + (isV22 ? 3 : 4)));
      let frameSize;
      if (isV22) frameSize = (tag[pos + 3] << 16) | (tag[pos + 4] << 8) | tag[pos + 5];
      else frameSize = major === 4 ? syncsafe(tag, pos + 4) : be32(tag, pos + 4);
      const formatFlags = isV22 ? 0 : tag[pos + 9];
      pos += headerSize;
      if (frameSize <= 0 || pos + frameSize > tag.length) break;
      let data = tag.subarray(pos, pos + frameSize);
      pos += frameSize;

      if (major === 4 && formatFlags & 0x01) data = data.subarray(4); // indicador de tamanho
      if (major === 4 && formatFlags & 0x02) data = removeUnsync(data);
      if (!isV22 && formatFlags & 0x0c) continue; // comprimido/criptografado: ignora

      const field = TEXT_FRAMES[id];
      if (field && data.length > 1 && out[field] == null) {
        const value = decodeText(data[0], data.subarray(1));
        if (value) out[field] = value;
      } else if ((id === "APIC" || id === "PIC") && data.length > 4) {
        const pic = parsePicture(data, isV22);
        // Prefere a capa frontal (tipo 3); senão fica com a primeira imagem.
        if (pic && (!picture || (picture.type !== 3 && pic.type === 3))) picture = pic;
      }
    }
    if (picture) out.picture = { mime: picture.mime, data: picture.data };
  }

  function parseV1(tail, out) {
    if (!tail || tail.length < 128 || tail[0] !== 0x54 || tail[1] !== 0x41 || tail[2] !== 0x47) return;
    const field = (start, len) => {
      let bytes = tail.subarray(start, start + len);
      const zero = bytes.indexOf(0);
      if (zero >= 0) bytes = bytes.subarray(0, zero);
      return latin1Decoder.decode(bytes).trim() || null;
    };
    out.title ??= field(3, 30);
    out.artist ??= field(33, 30);
    out.album ??= field(63, 30);
    out.year ??= field(93, 4);
    if (out.track == null && tail[125] === 0 && tail[126] !== 0) out.track = tail[126];
  }

  function parse(buf, tail) {
    const out = empty();
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    try { parseV2(bytes, out); } catch { /* tag corrompida: fica com o que já leu */ }
    try { parseV1(tail, out); } catch { /* idem */ }

    if (typeof out.track === "string") {
      const n = parseInt(out.track, 10);
      out.track = Number.isFinite(n) ? n : null;
    }
    if (out.year) out.year = out.year.slice(0, 4);
    return out;
  }

  async function readFile(file) {
    try {
      const head = new Uint8Array(await file.slice(0, 10).arrayBuffer());
      let length = 0;
      if (head.length === 10 && head[0] === 0x49 && head[1] === 0x44 && head[2] === 0x33) {
        length = 10 + syncsafe(head, 6) + 10; // +10 cobre um eventual rodapé
      }
      const [body, tail] = await Promise.all([
        length ? file.slice(0, length).arrayBuffer() : Promise.resolve(new ArrayBuffer(0)),
        file.size >= 128 ? file.slice(file.size - 128).arrayBuffer() : Promise.resolve(null),
      ]);
      return parse(body, tail ? new Uint8Array(tail) : null);
    } catch {
      return empty();
    }
  }

  return { parse, readFile };
})();

/* ==========================================================================
   library.js
   ========================================================================== */

/* Fruuly — biblioteca em memória: músicas, álbuns, artistas, curtidas, playlists e histórico. */
const Library = (() => {
  const UNKNOWN_ARTIST = "Artista desconhecido";
  const UNKNOWN_ALBUM = "Álbum desconhecido";

  const tracks = new Map(); // id → Track, na ordem de adição
  const likes = new Map(); // id → momento da curtida
  const playlists = new Map();
  let recent = [];
  let playlistCounter = 0;
  let clock = 0; // contador monotônico: ordena adições/curtidas mesmo no mesmo milissegundo
  let cache = null;
  const listeners = [];

  // Slug que nunca fica vazio (nomes só com caracteres não latinos, por exemplo).
  const makeId = (text) => Utils.slug(text) || `id-${Utils.hashString(text).toString(36)}`;

  function emit(kind) {
    if (kind === "tracks") cache = null;
    for (const fn of listeners) fn(kind);
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function addTracks(entries) {
    const added = [];
    for (const { file, tags = {}, coverUrl = null } of entries) {
      const id = `${file.name}:${file.size}`;
      if (tracks.has(id)) continue;
      const track = {
        id,
        file,
        title: tags.title || Utils.baseName(file.name),
        artist: tags.artist || UNKNOWN_ARTIST,
        album: tags.album || UNKNOWN_ALBUM,
        year: tags.year || null,
        trackNo: tags.track ?? null,
        duration: null,
        coverUrl,
        addedAt: ++clock,
      };
      tracks.set(id, track);
      added.push(track);
    }
    if (added.length) emit("tracks");
    return added;
  }

  const getTracks = () => [...tracks.values()];
  const getTrack = (id) => tracks.get(id) || null;

  function setDuration(id, sec) {
    const track = tracks.get(id);
    if (track && Number.isFinite(sec)) track.duration = sec;
  }

  const byTrackOrder = (a, b) =>
    (a.trackNo ?? Infinity) - (b.trackNo ?? Infinity) || a.title.localeCompare(b.title, "pt-BR");

  function build() {
    if (cache) return cache;
    const albums = new Map();
    const artists = new Map();
    for (const track of tracks.values()) {
      const albumId = makeId(`${track.artist} ${track.album}`);
      let album = albums.get(albumId);
      if (!album) {
        album = { id: albumId, title: track.album, artist: track.artist, year: track.year, coverUrl: null, tracks: [], addedAt: 0 };
        albums.set(albumId, album);
      }
      album.tracks.push(track);
      album.addedAt = Math.max(album.addedAt, track.addedAt);
      album.year ||= track.year;
      album.coverUrl ||= track.coverUrl;

      const artistId = makeId(track.artist);
      let artist = artists.get(artistId);
      if (!artist) {
        artist = { id: artistId, name: track.artist, tracks: [], albums: [], coverUrl: null };
        artists.set(artistId, artist);
      }
      artist.tracks.push(track);
      artist.coverUrl ||= track.coverUrl;
      if (!artist.albums.includes(album)) artist.albums.push(album);
    }
    for (const album of albums.values()) album.tracks.sort(byTrackOrder);
    cache = {
      albums: [...albums.values()].sort((a, b) => b.addedAt - a.addedAt),
      albumsById: albums,
      artists: [...artists.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
      artistsById: artists,
    };
    return cache;
  }

  const getAlbums = () => build().albums;
  const getAlbum = (id) => build().albumsById.get(id) || null;
  const getArtists = () => build().artists;
  const getArtist = (id) => build().artistsById.get(id) || null;

  function search(query) {
    const q = Utils.normalize(query);
    if (!q) return { top: null, tracks: [], albums: [], artists: [] };
    const matches = (text) => Utils.normalize(text).includes(q);
    const starts = (text) => Utils.normalize(text).startsWith(q);

    const foundArtists = getArtists().filter((a) => matches(a.name));
    const foundAlbums = getAlbums().filter((a) => matches(a.title) || matches(a.artist));
    const foundTracks = getTracks().filter((t) => matches(t.title) || matches(t.artist) || matches(t.album));

    const top =
      foundArtists.find((a) => starts(a.name)) ||
      foundAlbums.find((a) => starts(a.title)) ||
      foundTracks.find((t) => starts(t.title)) ||
      foundArtists[0] || foundAlbums[0] || foundTracks[0] || null;

    return { top, tracks: foundTracks, albums: foundAlbums, artists: foundArtists };
  }

  function toggleLike(id) {
    if (likes.has(id)) likes.delete(id);
    else likes.set(id, ++clock);
    emit("likes");
    return likes.has(id);
  }

  const isLiked = (id) => likes.has(id);

  function getLiked() {
    return [...likes.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => tracks.get(id))
      .filter(Boolean);
  }

  function createPlaylist(name) {
    playlistCounter++;
    const playlist = {
      id: `pl-${playlistCounter}`,
      name: (name && name.trim()) || `Minha playlist nº ${playlistCounter}`,
      trackIds: [],
      createdAt: ++clock,
    };
    playlists.set(playlist.id, playlist);
    emit("playlists");
    return playlist;
  }

  function renamePlaylist(id, name) {
    const playlist = playlists.get(id);
    if (!playlist || !name || !name.trim()) return false;
    playlist.name = name.trim();
    emit("playlists");
    return true;
  }

  function deletePlaylist(id) {
    const ok = playlists.delete(id);
    if (ok) emit("playlists");
    return ok;
  }

  function addToPlaylist(playlistId, trackId) {
    const playlist = playlists.get(playlistId);
    if (!playlist || !tracks.has(trackId) || playlist.trackIds.includes(trackId)) return false;
    playlist.trackIds.push(trackId);
    emit("playlists");
    return true;
  }

  function removeFromPlaylist(playlistId, trackId) {
    const playlist = playlists.get(playlistId);
    if (!playlist) return false;
    const before = playlist.trackIds.length;
    playlist.trackIds = playlist.trackIds.filter((id) => id !== trackId);
    if (playlist.trackIds.length !== before) emit("playlists");
    return playlist.trackIds.length !== before;
  }

  const getPlaylists = () => [...playlists.values()];
  const getPlaylist = (id) => playlists.get(id) || null;

  function getPlaylistTracks(id) {
    const playlist = playlists.get(id);
    return playlist ? playlist.trackIds.map((tid) => tracks.get(tid)).filter(Boolean) : [];
  }

  function markPlayed(id) {
    if (!tracks.has(id)) return;
    recent = [id, ...recent.filter((r) => r !== id)].slice(0, 30);
    emit("recent");
  }

  const getRecent = (limit = 6) => recent.slice(0, limit).map((id) => tracks.get(id)).filter(Boolean);

  return {
    addTracks,
    getTracks,
    getTrack,
    setDuration,
    getAlbums,
    getAlbum,
    getArtists,
    getArtist,
    search,
    toggleLike,
    isLiked,
    getLiked,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    getPlaylists,
    getPlaylist,
    getPlaylistTracks,
    markPlayed,
    getRecent,
    onChange,
  };
})();

/* ==========================================================================
   player.js
   ========================================================================== */

/* Fruuly — reprodução: fila, aleatório, repetir, volume e integração com as teclas de mídia. */
const Player = (() => {
  const VOLUME_KEY = "fruuly.volume";

  let audio = null;
  let list = []; // faixas do contexto atual, na ordem original
  let order = []; // índices de `list` na ordem em que vão tocar
  let pos = -1; // posição atual dentro de `order`
  let contextId = null;
  let shuffle = false;
  let repeat = "off";
  let objectUrl = null;
  const listeners = { track: [], state: [], time: [] };

  const emit = (event, payload) => listeners[event].forEach((fn) => fn(payload));
  const on = (event, fn) => listeners[event].push(fn);
  const current = () => (pos >= 0 ? list[order[pos]] : null);

  function readStoredVolume() {
    try {
      const v = parseFloat(localStorage.getItem(VOLUME_KEY));
      return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.8;
    } catch {
      return 0.8;
    }
  }

  function init(audioEl) {
    audio = audioEl;
    audio.volume = readStoredVolume();
    audio.addEventListener("play", () => emit("state", getState()));
    audio.addEventListener("pause", () => emit("state", getState()));
    audio.addEventListener("timeupdate", () => emit("time", getState()));
    audio.addEventListener("loadedmetadata", () => {
      const track = current();
      if (track && Number.isFinite(audio.duration)) Library.setDuration(track.id, audio.duration);
      emit("time", getState());
    });
    audio.addEventListener("ended", onEnded);
    setupMediaSession();
  }

  // Embaralha (Fisher–Yates) mantendo `first` na frente.
  function shuffledOrder(length, first) {
    const rest = [...Array(length).keys()].filter((i) => i !== first);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return [first, ...rest];
  }

  function buildOrder(first) {
    order = shuffle ? shuffledOrder(list.length, first) : [...list.keys()];
    pos = order.indexOf(first);
  }

  function load(autoplay = true) {
    const track = current();
    if (!track) return;
    const previousUrl = objectUrl;
    objectUrl = URL.createObjectURL(track.file);
    audio.src = objectUrl;
    audio.currentTime = 0;
    if (previousUrl) URL.revokeObjectURL(previousUrl);
    Library.markPlayed(track.id);
    updateMediaMetadata(track);
    emit("track", track);
    if (autoplay) play();
    else emit("state", getState());
  }

  function play() {
    if (!current()) return;
    const result = audio.play();
    if (result && result.catch) result.catch(() => emit("state", getState()));
  }

  function playList(tracks, startIndex = 0, ctxId = null) {
    if (!tracks.length) return;
    list = [...tracks];
    contextId = ctxId;
    buildOrder(Math.min(Math.max(0, startIndex), list.length - 1));
    load(true);
  }

  function toggle() {
    if (!current()) return;
    if (audio.paused) play();
    else audio.pause();
  }

  function stopAtEnd() {
    audio.pause();
    audio.currentTime = 0;
    emit("state", getState());
  }

  function next() {
    if (!current()) return;
    if (pos + 1 < order.length) pos++;
    else if (repeat === "all") pos = 0;
    else return stopAtEnd();
    load(true);
  }

  function prev() {
    if (!current()) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return emit("time", getState());
    }
    if (pos > 0) pos--;
    else if (repeat === "all") pos = order.length - 1;
    else {
      audio.currentTime = 0;
      return emit("time", getState());
    }
    load(true);
  }

  function onEnded() {
    if (repeat === "one") {
      audio.currentTime = 0;
      play();
    } else {
      next();
    }
  }

  function seek(sec) {
    if (!current() || !Number.isFinite(sec)) return;
    audio.currentTime = Math.max(0, sec);
    emit("time", getState());
  }

  function setVolume(v) {
    const volume = Math.min(1, Math.max(0, Number(v) || 0));
    audio.volume = volume;
    if (volume > 0 && audio.muted) audio.muted = false;
    try { localStorage.setItem(VOLUME_KEY, String(volume)); } catch { /* armazenamento indisponível */ }
    emit("state", getState());
  }

  function toggleMute() {
    audio.muted = !audio.muted;
    emit("state", getState());
  }

  function toggleShuffle() {
    shuffle = !shuffle;
    if (current()) buildOrder(order[pos]);
    emit("state", getState());
    return shuffle;
  }

  function cycleRepeat() {
    repeat = { off: "all", all: "one", one: "off" }[repeat];
    emit("state", getState());
    return repeat;
  }

  function getState() {
    const track = current();
    return {
      track,
      playing: !!audio && !audio.paused && !!track,
      shuffle,
      repeat,
      volume: audio ? audio.volume : 1,
      muted: audio ? audio.muted : false,
      contextId,
      currentTime: audio ? audio.currentTime || 0 : 0,
      duration: (audio && Number.isFinite(audio.duration) && audio.duration) || (track && track.duration) || 0,
    };
  }

  const getQueue = () => order.map((i) => list[i]);

  function setupMediaSession() {
    const session = navigator.mediaSession;
    if (!session) return;
    const handlers = {
      play: () => play(),
      pause: () => audio.pause(),
      previoustrack: () => prev(),
      nexttrack: () => next(),
      seekto: (details) => seek(details.seekTime),
    };
    for (const [action, fn] of Object.entries(handlers)) {
      try { session.setActionHandler(action, fn); } catch { /* ação não suportada */ }
    }
  }

  function updateMediaMetadata(track) {
    if (!navigator.mediaSession || typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: track.coverUrl ? [{ src: track.coverUrl, sizes: "512x512" }] : [],
    });
  }

  return {
    init,
    playList,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    getState,
    getQueue,
    on,
  };
})();

/* ==========================================================================
   views.js
   ========================================================================== */

/* Fruuly — renderização das telas a partir dos <template> do index.html. */
const Views = (() => {
  const DEFAULT_TINT = "#3a1a10";
  const NEUTRAL_TINT = "#242427";

  let currentRoute = { name: "home" };
  let homeFilter = "all";
  const colorCache = new Map();

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const viewEl = () => document.getElementById("view");

  function fromTemplate(id) {
    return document.getElementById(id).content.firstElementChild.cloneNode(true);
  }

  const slot = (node, name) => node.querySelector(`[data-slot="${name}"]`);

  function fillIcons(root = document) {
    for (const node of root.querySelectorAll("[data-icon]")) {
      if (!node.firstElementChild) node.innerHTML = Utils.icon(node.dataset.icon);
    }
  }

  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const totalDuration = (tracks) =>
    tracks.every((t) => t.duration) ? tracks.reduce((sum, t) => sum + t.duration, 0) : null;

  // ---------- Capas ----------

  // item: faixa, álbum, artista ou playlist. Sem imagem, gera uma capa a partir do nome.
  function cover(item, { round = false, liked = false } = {}) {
    if (liked) {
      return Utils.el("span", { class: "cover cover-liked", html: Utils.icon("heart-filled") });
    }
    const url = item && item.coverUrl;
    const label = (item && (item.album || item.title || item.name)) || "?";
    const node = Utils.el("span", { class: `cover${round ? " cover-round" : ""}` });
    if (url) {
      node.append(Utils.el("img", { src: url, alt: "", loading: "lazy", decoding: "async" }));
    } else {
      const seed = item && item.artist && item.album ? `${item.artist} ${item.album}` : label;
      const { from, to } = Utils.coverColors(seed);
      node.classList.add("cover-gen");
      node.style.setProperty("--c1", from);
      node.style.setProperty("--c2", to);
      node.append(Utils.el("span", { class: "cover-initial" }, [...label.trim()][0]?.toUpperCase() || "?"));
    }
    return node;
  }

  function playlistCoverSource(playlist) {
    const tracks = Library.getPlaylistTracks(playlist.id);
    const withCover = tracks.find((t) => t.coverUrl);
    return { coverUrl: withCover ? withCover.coverUrl : null, name: playlist.name };
  }

  // ---------- Cores (tom do cabeçalho e do player) ----------

  // Cor média da imagem, escurecida para o texto branco continuar legível.
  function averageColor(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 8;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, 8, 8);
          const data = ctx.getImageData(0, 0, 8, 8).data;
          let r = 0, g = 0, b = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }
          const n = data.length / 4;
          resolve(toTint(r / n, g / n, b / n));
        } catch {
          resolve(DEFAULT_TINT);
        }
      };
      img.onerror = () => resolve(DEFAULT_TINT);
      img.src = url;
    });
  }

  function toTint(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
    }
    const sat = Math.min(0.75, s * 1.1);
    return `hsl(${Math.round(h)} ${Math.round(sat * 100)}% 26%)`;
  }

  // Cor de destaque para um item (usa a capa quando existe).
  function colorFor(item) {
    if (!item) return Promise.resolve(DEFAULT_TINT);
    if (item.coverUrl) {
      if (!colorCache.has(item.coverUrl)) colorCache.set(item.coverUrl, averageColor(item.coverUrl));
      return colorCache.get(item.coverUrl);
    }
    const seed = item.artist && item.album ? `${item.artist} ${item.album}` : item.album || item.title || item.name || "";
    return Promise.resolve(Utils.coverColors(seed).to);
  }

  function applyHeaderTint(source) {
    const view = viewEl();
    const token = Symbol();
    view._tintToken = token;
    const promise = typeof source === "string" ? Promise.resolve(source) : colorFor(source);
    promise.then((color) => {
      if (view._tintToken === token) view.style.setProperty("--tint", color);
    });
  }

  // ---------- Peças reutilizáveis ----------

  function pageHead(title) {
    const head = fromTemplate("tpl-page-head");
    slot(head, "title").textContent = title;
    return head;
  }

  function section(title, items, { grid = true } = {}) {
    const node = fromTemplate("tpl-section");
    slot(node, "title").textContent = title;
    const box = slot(node, "items");
    if (!grid) box.className = "";
    box.append(...items);
    return node;
  }

  function card({ href, coverNode, title, subtitle, context, start }) {
    const node = fromTemplate("tpl-card");
    const link = slot(node, "link");
    link.href = href;
    slot(node, "cover").append(coverNode);
    slot(node, "title").textContent = title;
    slot(node, "title").title = title;
    slot(node, "subtitle").textContent = subtitle;
    const play = node.querySelector(".card-play");
    play.dataset.context = context;
    if (start) play.dataset.start = start;
    play.setAttribute("aria-label", `Tocar ${title}`);
    node.dataset.context = context;
    return node;
  }

  const albumCard = (album) =>
    card({
      href: `#/album/${album.id}`,
      coverNode: cover(album),
      title: album.title,
      subtitle: [album.year, album.artist].filter(Boolean).join(", "),
      context: `album:${album.id}`,
    });

  const artistCard = (artist) =>
    card({
      href: `#/artist/${artist.id}`,
      coverNode: cover({ coverUrl: artist.coverUrl, name: artist.name }, { round: true }),
      title: artist.name,
      subtitle: "Artista",
      context: `artist:${artist.id}`,
    });

  function trackCard(track) {
    const albumId = albumIdOf(track);
    return card({
      href: `#/album/${albumId}`,
      coverNode: cover(track),
      title: track.title,
      subtitle: track.artist,
      context: `album:${albumId}`,
      start: track.id,
    });
  }

  function quick({ href, coverNode, title, context }) {
    const node = fromTemplate("tpl-quick");
    slot(node, "link").href = href;
    slot(node, "cover").append(coverNode);
    slot(node, "title").textContent = title;
    const play = node.querySelector(".quick-play");
    play.dataset.context = context;
    play.setAttribute("aria-label", `Tocar ${title}`);
    node.dataset.context = context;
    return node;
  }

  function albumIdOf(track) {
    return Utils.slug(`${track.artist} ${track.album}`) || `id-${Utils.hashString(`${track.artist} ${track.album}`).toString(36)}`;
  }

  function trackList(tracks, context, { numbered = true } = {}) {
    const table = fromTemplate("tpl-track-list");
    const rows = slot(table, "rows");
    tracks.forEach((track, i) => {
      const row = fromTemplate("tpl-track-row");
      row.dataset.id = track.id;
      row.dataset.context = context;
      row.tabIndex = 0;
      row.setAttribute("aria-label", `${track.title}, ${track.artist}`);
      slot(row, "num").textContent = numbered && track.trackNo && context.startsWith("album:") ? track.trackNo : i + 1;
      slot(row, "cover").append(cover(track));
      slot(row, "title").textContent = track.title;
      slot(row, "title").title = track.title;
      slot(row, "artist").textContent = track.artist;
      slot(row, "album").textContent = track.album;
      slot(row, "duration").textContent = track.duration ? Utils.formatTime(track.duration) : "–";
      const like = row.querySelector('[data-action="toggle-like"]');
      like.dataset.id = track.id;
      setLikeButton(like, Library.isLiked(track.id));
      row.querySelector('[data-action="track-menu"]').dataset.id = track.id;
      rows.append(row);
    });
    return table;
  }

  function setLikeButton(button, liked) {
    button.setAttribute("aria-pressed", String(liked));
    button.setAttribute("aria-label", liked ? "Remover das curtidas" : "Curtir");
    button.innerHTML = Utils.icon(liked ? "heart-filled" : "heart");
  }

  function collectionHeader({ kind, title, meta, coverNode }) {
    const head = fromTemplate("tpl-collection-header");
    slot(head, "cover").append(coverNode);
    slot(head, "kind").textContent = kind;
    const titleEl = slot(head, "title");
    titleEl.textContent = title;
    if (title.length > 28) titleEl.classList.add("is-long");
    slot(head, "meta").append(...meta.filter(Boolean));
    return head;
  }

  function collectionActions(context, extras = []) {
    const actions = fromTemplate("tpl-collection-actions");
    actions.querySelector('[data-action="play-context"]').dataset.context = context;
    actions.querySelector('[data-action="shuffle-context"]').dataset.context = context;
    actions.dataset.context = context;
    slot(actions, "extra").append(...extras);
    return actions;
  }

  function emptyNote(title, text) {
    return Utils.el("div", { class: "empty-note" }, Utils.el("strong", {}, title), text);
  }

  const metaCount = (tracks) => {
    const total = totalDuration(tracks);
    return Utils.el("span", {}, plural(tracks.length, "música", "músicas") + (total ? `, ${Utils.formatDuration(total)}` : ""));
  };

  // ---------- Telas ----------

  function renderHome(view) {
    view.append(pageHead(Utils.greeting(new Date().getHours())));

    const filters = [
      ["all", "Tudo"],
      ["albums", "Álbuns"],
      ["artists", "Artistas"],
      ["liked", "Curtidas"],
    ];
    const chips = Utils.el("div", { class: "chips", role: "group", "aria-label": "Filtrar" });
    for (const [value, label] of filters) {
      chips.append(
        Utils.el("button", {
          class: `chip${homeFilter === value ? " is-active" : ""}`,
          "aria-pressed": String(homeFilter === value),
          onclick: () => {
            homeFilter = value;
            render(currentRoute);
          },
        }, label)
      );
    }
    view.append(chips);

    if (homeFilter === "albums") {
      view.append(section("Álbuns", Library.getAlbums().map(albumCard)));
      return;
    }
    if (homeFilter === "artists") {
      view.append(section("Artistas", Library.getArtists().map(artistCard)));
      return;
    }
    if (homeFilter === "liked") {
      const liked = Library.getLiked();
      view.append(
        liked.length
          ? trackList(liked, "liked", { numbered: false })
          : emptyNote("Nenhuma música curtida ainda", "Toque no coração de uma música para guardá-la aqui.")
      );
      return;
    }

    // Atalhos: curtidas, playlists e álbuns recentes (até 6)
    const quicks = [];
    if (Library.getLiked().length) {
      quicks.push(quick({ href: "#/liked", coverNode: cover(null, { liked: true }), title: "Músicas curtidas", context: "liked" }));
    }
    for (const playlist of Library.getPlaylists()) {
      if (!playlist.trackIds.length) continue;
      quicks.push(quick({ href: `#/playlist/${playlist.id}`, coverNode: cover(playlistCoverSource(playlist)), title: playlist.name, context: `playlist:${playlist.id}` }));
    }
    for (const album of Library.getAlbums()) {
      quicks.push(quick({ href: `#/album/${album.id}`, coverNode: cover(album), title: album.title, context: `album:${album.id}` }));
    }
    view.append(Utils.el("div", { class: "quick-grid" }, quicks.slice(0, 6)));

    const recent = Library.getRecent(8);
    if (recent.length) view.append(section("Tocadas recentemente", recent.map(trackCard)));
    view.append(section("Adicionadas recentemente", Library.getAlbums().slice(0, 12).map(albumCard)));
    const artists = Library.getArtists();
    if (artists.length) view.append(section("Artistas", artists.slice(0, 12).map(artistCard)));
  }

  function renderSearch(view, query = "") {
    const input = Utils.el("input", {
      class: "search-input",
      type: "search",
      placeholder: "O que você quer ouvir?",
      "aria-label": "Buscar músicas, artistas ou álbuns",
      autocomplete: "off",
      spellcheck: "false",
      value: query,
    });
    const results = Utils.el("div", { class: "search-results" });
    input.addEventListener("input", () => {
      const q = input.value;
      history.replaceState(null, "", q.trim() ? `#/search/${encodeURIComponent(q)}` : "#/search");
      currentRoute = { name: "search", query: q };
      renderSearchResults(results, q);
    });
    view.append(
      Utils.el("div", { class: "search-bar" },
        Utils.el("label", { class: "search-field", html: Utils.icon("search") }, input))
    );
    view.append(results);
    renderSearchResults(results, query);
    requestAnimationFrame(() => {
      input.focus({ preventScroll: true });
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }

  function renderSearchResults(box, query) {
    box.replaceChildren();
    if (!query.trim()) {
      const items = [
        ...Library.getArtists().map((a) => ({ href: `#/artist/${a.id}`, name: a.name, source: { coverUrl: a.coverUrl, name: a.name }, round: true })),
        ...Library.getAlbums().map((a) => ({ href: `#/album/${a.id}`, name: a.title, source: a, round: false })),
      ].slice(0, 16);
      const tiles = items.map((item) => {
        const tile = Utils.el("a", { class: "browse-tile", href: item.href },
          Utils.el("span", { class: "browse-tile-name" }, item.name),
          cover(item.source, { round: item.round }));
        tile.style.setProperty("--c1", Utils.coverColors(item.name).from);
        return tile;
      });
      box.append(section("Navegar por tudo", [Utils.el("div", { class: "browse-grid" }, tiles)], { grid: false }));
      return;
    }

    const r = Library.search(query);
    if (!r.top) {
      box.append(Utils.el("div", { class: "no-results" },
        Utils.el("strong", {}, `Nenhum resultado para “${query.trim()}”`),
        Utils.el("p", {}, "Confira a ortografia ou tente outro nome.")));
      return;
    }

    const top = r.top;
    let topNode;
    if (top.file) {
      const albumId = albumIdOf(top);
      topNode = topResult(`#/album/${albumId}`, cover(top), top.title, "Música", top.artist, `album:${albumId}`, top.id);
    } else if (top.tracks && top.name) {
      topNode = topResult(`#/artist/${top.id}`, cover({ coverUrl: top.coverUrl, name: top.name }, { round: true }), top.name, "Artista", "", `artist:${top.id}`);
    } else {
      topNode = topResult(`#/album/${top.id}`, cover(top), top.title, "Álbum", top.artist, `album:${top.id}`);
    }

    const songs = Utils.el("div", { class: "search-songs" });
    if (r.tracks.length) songs.append(trackList(r.tracks.slice(0, 4), "search", { numbered: false }));
    else songs.append(emptyNote("Nenhuma música", "Veja os álbuns e artistas encontrados."));

    box.append(Utils.el("div", { class: "search-top" },
      Utils.el("section", {}, Utils.el("h2", { class: "shelf-title" }, "Melhor resultado"), topNode),
      Utils.el("section", {}, Utils.el("h2", { class: "shelf-title" }, "Músicas"), songs)));
    if (r.artists.length) box.append(section("Artistas", r.artists.map(artistCard)));
    if (r.albums.length) box.append(section("Álbuns", r.albums.map(albumCard)));
    fillIcons(box);
    highlightPlaying();
  }

  function topResult(href, coverNode, title, kind, sub, context, start) {
    const play = Utils.el("button", { class: "card-play", "data-action": "play-context", "aria-label": `Tocar ${title}`, html: Utils.icon("play") });
    play.dataset.context = context;
    if (start) play.dataset.start = start;
    return Utils.el("article", { class: "top-result", "data-context": context },
      Utils.el("a", { href, class: "card-hit" },
        coverNode,
        Utils.el("span", { class: "top-result-title" }, title),
        Utils.el("span", { class: "top-result-sub" },
          Utils.el("span", { class: "pill" }, kind),
          sub ? Utils.el("span", { class: "card-sub" }, sub) : null)),
      play);
  }

  function libraryItem({ href, coverNode, title, subtitle, context }) {
    const node = fromTemplate("tpl-library-item");
    const link = slot(node, "link");
    link.href = href;
    link.dataset.context = context;
    link.title = title;
    slot(link, "cover").append(coverNode);
    slot(link, "title").textContent = title;
    slot(link, "subtitle").textContent = subtitle;
    return node;
  }

  function libraryItems({ includeArtists = false } = {}) {
    const items = [
      libraryItem({
        href: "#/liked",
        coverNode: cover(null, { liked: true }),
        title: "Músicas curtidas",
        subtitle: `Playlist, ${plural(Library.getLiked().length, "música", "músicas")}`,
        context: "liked",
      }),
    ];
    for (const playlist of Library.getPlaylists()) {
      items.push(libraryItem({
        href: `#/playlist/${playlist.id}`,
        coverNode: cover(playlistCoverSource(playlist)),
        title: playlist.name,
        subtitle: `Playlist, ${plural(playlist.trackIds.length, "música", "músicas")}`,
        context: `playlist:${playlist.id}`,
      }));
    }
    for (const album of Library.getAlbums()) {
      items.push(libraryItem({ href: `#/album/${album.id}`, coverNode: cover(album), title: album.title, subtitle: `Álbum de ${album.artist}`, context: `album:${album.id}` }));
    }
    if (includeArtists) {
      for (const artist of Library.getArtists()) {
        items.push(libraryItem({
          href: `#/artist/${artist.id}`,
          coverNode: cover({ coverUrl: artist.coverUrl, name: artist.name }, { round: true }),
          title: artist.name,
          subtitle: "Artista",
          context: `artist:${artist.id}`,
        }));
      }
    }
    return items;
  }

  function renderLibrary(view) {
    const head = pageHead("Sua biblioteca");
    head.append(Utils.el("button", {
      class: "btn btn-ghost btn-small",
      "data-action": "new-playlist",
      "aria-label": "Nova playlist",
      html: `${Utils.icon("plus")}<span class="btn-label">Nova playlist</span>`,
    }));
    head.querySelector('[data-action="pick-files"]').remove();
    const addButton = Utils.el("button", { class: "btn btn-ghost btn-small", "data-action": "pick-files", "aria-label": "Adicionar músicas", html: `${Utils.icon("upload")}<span class="btn-label">Adicionar músicas</span>` });
    const actions = Utils.el("div", { class: "coll-extra" }, addButton, head.lastElementChild);
    head.append(actions);
    view.classList.add("library-page");
    view.append(head, Utils.el("ul", { class: "library-list" }, libraryItems({ includeArtists: true })));
  }

  function renderAlbum(view, id) {
    const album = Library.getAlbum(id);
    if (!album) return false;
    const artistId = Utils.slug(album.artist) || `id-${Utils.hashString(album.artist).toString(36)}`;
    view.append(collectionHeader({
      kind: "Álbum",
      title: album.title,
      coverNode: cover(album),
      meta: [
        Utils.el("a", { href: `#/artist/${artistId}` }, Utils.el("strong", {}, album.artist)),
        album.year ? Utils.el("span", {}, album.year) : null,
        metaCount(album.tracks),
      ],
    }));
    view.append(collectionActions(`album:${album.id}`), trackList(album.tracks, `album:${album.id}`));
    applyHeaderTint(album);
    return true;
  }

  function renderArtist(view, id) {
    const artist = Library.getArtist(id);
    if (!artist) return false;
    view.append(collectionHeader({
      kind: "Artista",
      title: artist.name,
      coverNode: cover({ coverUrl: artist.coverUrl, name: artist.name }, { round: true }),
      meta: [
        Utils.el("span", {}, plural(artist.tracks.length, "música", "músicas")),
        Utils.el("span", {}, plural(artist.albums.length, "álbum", "álbuns")),
      ],
    }));
    view.append(collectionActions(`artist:${artist.id}`));
    view.append(Utils.el("h2", { class: "shelf-title" }, "Músicas"), trackList(artist.tracks, `artist:${artist.id}`, { numbered: false }));
    view.append(section("Álbuns", artist.albums.map(albumCard)));
    applyHeaderTint({ coverUrl: artist.coverUrl, name: artist.name });
    return true;
  }

  function renderPlaylist(view, id) {
    const playlist = Library.getPlaylist(id);
    if (!playlist) return false;
    const tracks = Library.getPlaylistTracks(id);
    const source = playlistCoverSource(playlist);
    view.append(collectionHeader({
      kind: "Playlist",
      title: playlist.name,
      coverNode: cover(source),
      meta: [tracks.length ? metaCount(tracks) : Utils.el("span", {}, "Vazia")],
    }));
    const extras = [
      Utils.el("button", { class: "icon-btn icon-btn-big", "data-action": "rename-playlist", "data-id": id, "aria-label": "Renomear playlist", title: "Renomear", html: Utils.icon("edit") }),
      Utils.el("button", { class: "icon-btn icon-btn-big", "data-action": "delete-playlist", "data-id": id, "aria-label": "Excluir playlist", title: "Excluir", html: Utils.icon("trash") }),
    ];
    const actions = collectionActions(`playlist:${id}`, extras);
    if (!tracks.length) actions.querySelectorAll(".play-btn, [data-action='shuffle-context']").forEach((b) => b.remove());
    view.append(actions);
    view.append(
      tracks.length
        ? trackList(tracks, `playlist:${id}`, { numbered: false })
        : emptyNote("Essa playlist está vazia", "Abra as opções de qualquer música e escolha “Adicionar à playlist”.")
    );
    applyHeaderTint(source);
    return true;
  }

  function renderLiked(view) {
    const liked = Library.getLiked();
    view.append(collectionHeader({
      kind: "Playlist",
      title: "Músicas curtidas",
      coverNode: cover(null, { liked: true }),
      meta: [liked.length ? metaCount(liked) : Utils.el("span", {}, "Vazia")],
    }));
    if (liked.length) {
      view.append(collectionActions("liked"), trackList(liked, "liked", { numbered: false }));
    } else {
      view.append(emptyNote("Nenhuma música curtida ainda", "Toque no coração de uma música para guardá-la aqui."));
    }
    applyHeaderTint("#5a1530");
    return true;
  }

  // ---------- API pública ----------

  function render(route) {
    currentRoute = route;
    const view = viewEl();
    view.replaceChildren();
    view.classList.remove("library-page");
    view.style.setProperty("--tint", route.name === "home" ? DEFAULT_TINT : NEUTRAL_TINT);
    view._tintToken = null;

    const hasMusic = Library.getTracks().length > 0;
    let ok = true;
    if (!hasMusic && !["playlist", "liked"].includes(route.name)) {
      view.append(fromTemplate("tpl-empty"));
      view.style.setProperty("--tint", DEFAULT_TINT);
    } else {
      switch (route.name) {
        case "home": renderHome(view); break;
        case "search": renderSearch(view, route.query || ""); break;
        case "library": renderLibrary(view); break;
        case "album": ok = renderAlbum(view, route.id); break;
        case "artist": ok = renderArtist(view, route.id); break;
        case "playlist": ok = renderPlaylist(view, route.id); break;
        case "liked": ok = renderLiked(view); break;
        default: ok = false;
      }
    }
    if (!ok) return false;

    fillIcons(view);
    highlightPlaying();
    renderSidebarLibrary();
    return true;
  }

  // Atualiza só os resultados da busca, sem recriar o campo (mantém o foco e o texto).
  function refreshSearch() {
    const box = $(".search-results", viewEl());
    if (box) renderSearchResults(box, currentRoute.query || "");
  }

  function renderSidebarLibrary() {
    const list = document.getElementById("library-list");
    list.replaceChildren(...libraryItems());
    const hash = location.hash || "#/";
    for (const link of $$(".lib-item")) {
      link.classList.toggle("is-active", link.getAttribute("href") === hash);
    }
    fillIcons(list);
    highlightPlaying();
  }

  function highlightPlaying() {
    const { track, playing, contextId } = Player.getState();
    document.body.classList.toggle("is-paused", !playing);
    for (const row of $$(".track-body .track-row")) {
      row.classList.toggle("is-playing", !!track && row.dataset.id === track.id);
    }
    for (const node of $$(".card[data-context], .quick[data-context], .top-result[data-context], .lib-item[data-context]")) {
      node.classList.toggle("is-playing", !!track && node.dataset.context === contextId);
    }
    // Botões "tocar" do contexto atual viram "pausar"
    for (const button of $$('[data-action="play-context"]')) {
      const active = !!track && playing && button.dataset.context === contextId && (!button.dataset.start || button.dataset.start === track.id);
      button.innerHTML = Utils.icon(active ? "pause" : "play");
      button.dataset.active = String(active);
    }
  }

  function updateDuration(track) {
    for (const row of $$(".track-body .track-row")) {
      if (row.dataset.id === track.id) row.querySelector(".tr-dur").textContent = Utils.formatTime(track.duration);
    }
  }

  function updateLikes() {
    for (const button of $$('[data-action="toggle-like"][data-id]')) {
      setLikeButton(button, Library.isLiked(button.dataset.id));
    }
  }

  const getRoute = () => currentRoute;

  return {
    render,
    refreshSearch,
    renderSidebarLibrary,
    highlightPlaying,
    updateDuration,
    updateLikes,
    cover,
    colorFor,
    applyHeaderTint,
    fillIcons,
    albumIdOf,
    getRoute,
  };
})();

/* ==========================================================================
   app.js
   ========================================================================== */

/* Fruuly — inicialização, rotas, arquivos, eventos e sincronização do player com a tela. */
const App = (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  let seeking = false;
  let menuAnchor = null;
  let dragDepth = 0;

  // ---------- Avisos ----------

  function toast(message) {
    const region = $("#toast-region");
    while (region.children.length >= 3) region.firstElementChild.remove();
    const node = Utils.el("div", { class: "toast", role: "status" }, message);
    region.append(node);
    setTimeout(() => {
      node.classList.add("is-leaving");
      setTimeout(() => node.remove(), 250);
    }, 2800);
  }

  // ---------- Rotas ----------

  function parseRoute(hash) {
    const parts = (hash || "").replace(/^#\/?/, "").split("/");
    const name = parts[0] || "home";
    const rest = parts.slice(1).join("/");
    const value = rest ? decodeURIComponent(rest) : "";
    switch (name) {
      case "search": return { name, query: value };
      case "library":
      case "liked": return { name };
      case "album":
      case "artist":
      case "playlist": return value ? { name, id: value } : null;
      case "home": return { name: "home" };
      default: return null;
    }
  }

  function route() {
    const parsed = parseRoute(location.hash);
    if (!parsed || !Views.render(parsed)) {
      location.replace("#/");
      return;
    }
    closeMenu();
    closeFullscreen();
    const main = $("#main");
    main.scrollTop = 0;
    const view = $("#view");
    view.classList.remove("view-enter");
    void view.offsetWidth; // reinicia a animação de entrada
    view.classList.add("view-enter");
    updateNav(parsed.name);
  }

  function updateNav(name) {
    for (const link of $$(".nav-link[data-route]")) {
      const active = link.dataset.route === name;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  }

  // Re-renderiza a tela atual sem rolar para o topo (após mudanças na biblioteca).
  function refreshView() {
    const current = Views.getRoute();
    if (current.name === "search") {
      Views.refreshSearch();
      Views.renderSidebarLibrary();
      return;
    }
    const scroll = $("#main").scrollTop;
    if (!Views.render(current)) {
      location.replace("#/");
      return;
    }
    $("#main").scrollTop = scroll;
  }

  // ---------- Reprodução por contexto ----------

  function resolveContext(context) {
    const [kind, ...rest] = (context || "").split(":");
    const id = rest.join(":");
    switch (kind) {
      case "album": return Library.getAlbum(id)?.tracks || [];
      case "artist": return Library.getArtist(id)?.tracks || [];
      case "playlist": return Library.getPlaylistTracks(id);
      case "liked": return Library.getLiked();
      case "search": return Library.search(Views.getRoute().query || "").tracks;
      default: return [];
    }
  }

  function playContext(context, startId, { shuffle = false } = {}) {
    const state = Player.getState();
    if (!shuffle && state.track && state.contextId === context && (!startId || startId === state.track.id)) {
      Player.toggle();
      return;
    }
    const tracks = resolveContext(context);
    if (!tracks.length) return;
    let index = startId ? Math.max(0, tracks.findIndex((t) => t.id === startId)) : 0;
    if (shuffle) {
      if (!state.shuffle) Player.toggleShuffle();
      index = Math.floor(Math.random() * tracks.length);
    }
    Player.playList(tracks, index, context);
  }

  function playTrackRow(row) {
    const state = Player.getState();
    if (state.track && state.track.id === row.dataset.id && state.contextId === row.dataset.context) {
      Player.toggle();
    } else {
      playContext(row.dataset.context, row.dataset.id);
    }
  }

  function toggleLike(trackId) {
    const liked = Library.toggleLike(trackId);
    toast(liked ? "Adicionada às Músicas curtidas" : "Removida das Músicas curtidas");
  }

  // ---------- Adicionar arquivos ----------

  async function addFiles(fileList) {
    const files = [...fileList];
    const audioFiles = files.filter(Utils.isAudioFile);
    if (!audioFiles.length) {
      toast("Nenhum arquivo MP3 encontrado");
      return;
    }
    // Pula as que já estão na biblioteca antes de ler as tags (evita capas órfãs).
    const fresh = audioFiles.filter((file) => !Library.getTrack(`${file.name}:${file.size}`));
    if (!fresh.length) {
      toast("Essas músicas já estão na biblioteca");
      return;
    }

    const entries = [];
    for (let i = 0; i < fresh.length; i += 8) {
      const batch = fresh.slice(i, i + 8);
      const tags = await Promise.all(batch.map((file) => ID3.readFile(file)));
      batch.forEach((file, j) => {
        const pic = tags[j].picture;
        const coverUrl = pic ? URL.createObjectURL(new Blob([pic.data], { type: pic.mime })) : null;
        entries.push({ file, tags: tags[j], coverUrl });
      });
    }

    const added = Library.addTracks(entries);
    toast(added.length === 1 ? "1 música adicionada" : `${added.length} músicas adicionadas`);
    loadDurations(added);
  }

  // Lê a duração de cada faixa nova em segundo plano, uma de cada vez.
  async function loadDurations(tracks) {
    const probe = new Audio();
    probe.preload = "metadata";
    for (const track of tracks) {
      const url = URL.createObjectURL(track.file);
      const duration = await new Promise((resolve) => {
        const done = () => {
          clearTimeout(timer);
          probe.onloadedmetadata = probe.onerror = null;
          resolve(probe.duration);
        };
        const timer = setTimeout(done, 5000);
        probe.onloadedmetadata = done;
        probe.onerror = done;
        probe.src = url;
      });
      URL.revokeObjectURL(url);
      if (Number.isFinite(duration)) {
        Library.setDuration(track.id, duration);
        Views.updateDuration(Library.getTrack(track.id));
      }
    }
    probe.removeAttribute("src");
    const current = Views.getRoute().name;
    if (["album", "artist", "playlist", "liked"].includes(current)) refreshView();
  }

  // Percorre pastas soltas na janela.
  async function filesFromDrop(dataTransfer) {
    const entries = [...(dataTransfer.items || [])]
      .map((item) => (item.webkitGetAsEntry ? item.webkitGetAsEntry() : null))
      .filter(Boolean);
    if (!entries.length) return [...dataTransfer.files];

    const files = [];
    const readEntries = (reader) => new Promise((resolve) => reader.readEntries(resolve, () => resolve([])));
    const fileOf = (entry) => new Promise((resolve) => entry.file(resolve, () => resolve(null)));
    async function walk(entry) {
      if (entry.isFile) {
        const file = await fileOf(entry);
        if (file) files.push(file);
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        let batch;
        do {
          batch = await readEntries(reader);
          for (const child of batch) await walk(child);
        } while (batch.length);
      }
    }
    for (const entry of entries) await walk(entry);
    return files;
  }

  function setupFileInputs() {
    for (const id of ["file-input", "folder-input"]) {
      const input = document.getElementById(id);
      input.addEventListener("change", () => {
        if (input.files.length) addFiles(input.files);
        input.value = "";
      });
    }

    const overlay = $("#drop-overlay");
    const hasFiles = (e) => e.dataTransfer && [...e.dataTransfer.types].includes("Files");
    window.addEventListener("dragenter", (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragDepth++;
      overlay.hidden = false;
    });
    window.addEventListener("dragover", (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    });
    window.addEventListener("dragleave", (e) => {
      if (!hasFiles(e)) return;
      dragDepth = Math.max(0, dragDepth - 1);
      if (!dragDepth) overlay.hidden = true;
    });
    window.addEventListener("drop", async (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragDepth = 0;
      overlay.hidden = true;
      addFiles(await filesFromDrop(e.dataTransfer));
    });
  }

  // ---------- Menu de opções da faixa ----------

  function menuItem(icon, label, onSelect, { active = false } = {}) {
    return Utils.el("button", {
      class: `menu-item${active ? " is-active" : ""}`,
      role: "menuitem",
      html: `${Utils.icon(icon)}<span>${Utils.escape(label)}</span>`,
      onclick: () => onSelect(),
    });
  }

  function openTrackMenu(trackId, anchor, context, point) {
    const track = Library.getTrack(trackId);
    if (!track) return;
    const menu = $("#menu");
    const albumId = Views.albumIdOf(track);
    const artistId = Utils.slug(track.artist) || `id-${Utils.hashString(track.artist).toString(36)}`;
    const liked = Library.isLiked(track.id);
    const head = Utils.el("div", { class: "menu-head" }, Views.cover(track),
      Utils.el("div", { class: "menu-head-text" }, Utils.el("strong", {}, track.title), Utils.el("span", {}, track.artist)));

    const showMain = () => {
      const items = [
        head,
        menuItem(liked ? "heart-filled" : "heart", liked ? "Remover das curtidas" : "Curtir", () => {
          closeMenu();
          toggleLike(track.id);
        }, { active: liked }),
        menuItem("plus", "Adicionar à playlist", showPlaylists),
      ];
      if (context && context.startsWith("playlist:")) {
        const playlistId = context.slice("playlist:".length);
        items.push(menuItem("close", "Remover desta playlist", () => {
          closeMenu();
          Library.removeFromPlaylist(playlistId, track.id);
          toast("Removida da playlist");
        }));
      }
      items.push(
        Utils.el("div", { class: "menu-sep", role: "separator" }),
        menuItem("disc", "Ir para o álbum", () => {
          closeMenu();
          location.hash = `#/album/${albumId}`;
        }),
        menuItem("user", "Ir para o artista", () => {
          closeMenu();
          location.hash = `#/artist/${artistId}`;
        })
      );
      menu.replaceChildren(...items);
      focusFirstItem();
    };

    const showPlaylists = () => {
      const items = [
        menuItem("chevron-left", "Voltar", showMain),
        Utils.el("p", { class: "menu-label" }, "Adicionar a"),
        menuItem("plus", "Nova playlist", () => {
          const playlist = Library.createPlaylist();
          Library.addToPlaylist(playlist.id, track.id);
          closeMenu();
          toast(`Adicionada a ${playlist.name}`);
        }),
      ];
      for (const playlist of Library.getPlaylists()) {
        items.push(menuItem("music", playlist.name, () => {
          const ok = Library.addToPlaylist(playlist.id, track.id);
          closeMenu();
          toast(ok ? `Adicionada a ${playlist.name}` : `Já está em ${playlist.name}`);
        }));
      }
      menu.replaceChildren(...items);
      focusFirstItem();
    };

    menuAnchor = anchor;
    showMain();
    menu.hidden = false;
    $("#menu-backdrop").hidden = false;
    positionMenu(anchor, point);
  }

  function positionMenu(anchor, point) {
    const menu = $("#menu");
    const margin = 8;
    const { innerWidth: vw, innerHeight: vh } = window;
    const box = menu.getBoundingClientRect();
    let left;
    let top;
    if (point) {
      left = point.x;
      top = point.y;
    } else {
      const rect = anchor.getBoundingClientRect();
      left = rect.right - box.width;
      top = rect.bottom + 4;
      if (top + box.height > vh - margin) top = rect.top - box.height - 4;
    }
    left = Math.min(Math.max(margin, left), vw - box.width - margin);
    top = Math.min(Math.max(margin, top), vh - box.height - margin);
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function focusFirstItem() {
    const first = $("#menu .menu-item");
    if (first) first.focus({ preventScroll: true });
  }

  function closeMenu() {
    const menu = $("#menu");
    if (menu.hidden) return;
    menu.hidden = true;
    $("#menu-backdrop").hidden = true;
    if (menuAnchor && document.contains(menuAnchor)) menuAnchor.focus({ preventScroll: true });
    menuAnchor = null;
  }

  // ---------- Playlists ----------

  function newPlaylist() {
    const playlist = Library.createPlaylist();
    toast(`${playlist.name} criada`);
    location.hash = `#/playlist/${playlist.id}`;
  }

  function renamePlaylist(id) {
    const playlist = Library.getPlaylist(id);
    if (!playlist) return;
    const name = prompt("Novo nome da playlist", playlist.name);
    if (name && Library.renamePlaylist(id, name)) toast("Playlist renomeada");
  }

  function deletePlaylist(id) {
    const playlist = Library.getPlaylist(id);
    if (!playlist || !confirm(`Excluir a playlist “${playlist.name}”?`)) return;
    Library.deletePlaylist(id);
    toast("Playlist excluída");
  }

  // ---------- Player em tela cheia ----------

  function openFullscreen() {
    if (!Player.getState().track) return;
    const fs = $("#fullscreen-player");
    fs.hidden = false;
    fs.style.transform = "";
    $('[data-action="close-fullscreen"]', fs).focus({ preventScroll: true });
  }

  function closeFullscreen() {
    const fs = $("#fullscreen-player");
    if (fs.hidden) return;
    fs.hidden = true;
    const opener = $(".mini-open");
    if (opener && getComputedStyle(opener).display !== "none") opener.focus({ preventScroll: true });
  }

  // Arrastar para baixo fecha o player (toque).
  function setupFullscreenGesture() {
    const fs = $("#fullscreen-player");
    let startY = null;
    let dy = 0;
    fs.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "touch" || e.target.closest(".range, button")) return;
      startY = e.clientY;
      dy = 0;
      fs.style.transition = "none";
    });
    fs.addEventListener("pointermove", (e) => {
      if (startY == null) return;
      dy = Math.max(0, e.clientY - startY);
      fs.style.transform = `translateY(${dy}px)`;
    });
    const end = () => {
      if (startY == null) return;
      fs.style.transition = "";
      if (dy > 80) closeFullscreen();
      fs.style.transform = "";
      startY = null;
    };
    fs.addEventListener("pointerup", end);
    fs.addEventListener("pointercancel", end);
  }

  // ---------- Sincronização do player com a tela ----------

  const setRangeFill = (range) => {
    const max = parseFloat(range.max) || 0;
    const pct = max ? (parseFloat(range.value) / max) * 100 : 0;
    range.style.setProperty("--p", `${pct}%`);
  };

  function onTrack(track) {
    for (const node of $$(".now-title")) node.textContent = track.title;
    for (const node of $$(".now-artist")) node.textContent = track.artist;
    for (const node of $$(".now-cover")) node.replaceChildren(Views.cover(track));
    $("#mini-player").hidden = false;
    document.title = `${track.title} · ${track.artist} — Fruuly`;
    Views.colorFor(track).then((color) => document.documentElement.style.setProperty("--ambient", color));
    updateLikeButtons();
    Views.highlightPlaying();
  }

  function onState(state) {
    for (const button of $$('[data-action="play"]')) {
      button.innerHTML = Utils.icon(state.playing ? "pause" : "play");
      button.setAttribute("aria-label", state.playing ? "Pausar" : "Tocar");
    }
    for (const button of $$('[data-action="shuffle"]')) {
      button.classList.toggle("is-active", state.shuffle);
      button.setAttribute("aria-pressed", String(state.shuffle));
    }
    const repeatLabel = { off: "desligado", all: "todas", one: "esta música" }[state.repeat];
    for (const button of $$('[data-action="repeat"]')) {
      button.innerHTML = Utils.icon(state.repeat === "one" ? "repeat-one" : "repeat");
      button.classList.toggle("is-active", state.repeat !== "off");
      button.setAttribute("aria-label", `Repetir: ${repeatLabel}`);
    }
    const silent = state.muted || state.volume === 0;
    for (const button of $$('[data-action="mute"]')) {
      button.innerHTML = Utils.icon(silent ? "volume-mute" : "volume");
      button.setAttribute("aria-label", silent ? "Ativar som" : "Silenciar");
    }
    for (const range of $$(".volume")) {
      range.value = state.muted ? 0 : state.volume;
      setRangeFill(range);
    }
    Views.highlightPlaying();
  }

  function onTime(state) {
    const duration = state.duration || 0;
    for (const node of $$(".time-total")) node.textContent = Utils.formatTime(duration);
    const pct = duration ? `${(state.currentTime / duration) * 100}%` : "0%";
    $(".mini-progress span").style.setProperty("--p", pct);
    if (seeking) return;
    for (const node of $$(".time-current")) node.textContent = Utils.formatTime(state.currentTime);
    for (const range of $$(".seek")) {
      range.max = duration;
      range.value = state.currentTime;
      setRangeFill(range);
    }
  }

  function updateLikeButtons() {
    const { track } = Player.getState();
    const liked = !!track && Library.isLiked(track.id);
    for (const button of $$('[data-action="like"]')) {
      button.disabled = !track;
      button.setAttribute("aria-pressed", String(liked));
      button.setAttribute("aria-label", liked ? "Remover das curtidas" : "Curtir");
      button.innerHTML = Utils.icon(liked ? "heart-filled" : "heart");
    }
  }

  function setupRanges() {
    for (const range of $$(".seek")) {
      range.addEventListener("pointerdown", () => range.classList.add("is-dragging"));
      range.addEventListener("input", () => {
        seeking = true;
        for (const node of $$(".time-current")) node.textContent = Utils.formatTime(parseFloat(range.value));
        setRangeFill(range);
      });
      range.addEventListener("change", () => {
        seeking = false;
        range.classList.remove("is-dragging");
        Player.seek(parseFloat(range.value));
      });
    }
    for (const range of $$(".volume")) {
      range.addEventListener("input", () => {
        Player.setVolume(parseFloat(range.value));
        setRangeFill(range);
      });
    }
    window.addEventListener("pointerup", () => $$(".range.is-dragging").forEach((r) => r.classList.remove("is-dragging")));
  }

  // ---------- Eventos globais ----------

  function onClick(e) {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const { action } = target.dataset;
    switch (action) {
      case "pick-files": $("#file-input").click(); break;
      case "pick-folder": $("#folder-input").click(); break;
      case "play-context":
        e.preventDefault();
        playContext(target.dataset.context, target.dataset.start);
        break;
      case "shuffle-context": playContext(target.dataset.context, null, { shuffle: true }); break;
      case "play-track": playTrackRow(target); break;
      case "toggle-like": toggleLike(target.dataset.id); break;
      case "track-menu": {
        const row = target.closest(".track-row");
        openTrackMenu(target.dataset.id, target, row && row.dataset.context);
        break;
      }
      case "like": {
        const { track } = Player.getState();
        if (track) toggleLike(track.id);
        break;
      }
      case "play": Player.toggle(); break;
      case "prev": Player.prev(); break;
      case "next": Player.next(); break;
      case "shuffle": Player.toggleShuffle(); break;
      case "repeat": Player.cycleRepeat(); break;
      case "mute": Player.toggleMute(); break;
      case "open-fullscreen": openFullscreen(); break;
      case "close-fullscreen": closeFullscreen(); break;
      case "new-playlist": newPlaylist(); break;
      case "rename-playlist": renamePlaylist(target.dataset.id); break;
      case "delete-playlist": deletePlaylist(target.dataset.id); break;
    }
  }

  function onKeydown(e) {
    const menuOpen = !$("#menu").hidden;
    if (e.key === "Escape") {
      if (menuOpen) closeMenu();
      else closeFullscreen();
      return;
    }
    if (menuOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const items = $$("#menu .menu-item");
      const index = items.indexOf(document.activeElement);
      const next = e.key === "ArrowDown" ? index + 1 : index - 1;
      items[(next + items.length) % items.length]?.focus();
      return;
    }

    const el = e.target;
    if (el.matches("input, textarea, select, [contenteditable]") || menuOpen) return;

    if (e.key === "Enter" && el.matches('[data-action="play-track"]')) {
      e.preventDefault();
      playTrackRow(el);
      return;
    }
    if (el.matches("button, a")) return; // espaço/Enter já acionam o próprio botão
    if (e.key === " ") {
      e.preventDefault();
      Player.toggle();
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const { track, currentTime } = Player.getState();
      if (!track) return;
      e.preventDefault();
      Player.seek(currentTime + (e.key === "ArrowRight" ? 5 : -5));
    }
  }

  function onContextMenu(e) {
    const row = e.target.closest(".track-body .track-row");
    if (!row) return;
    e.preventDefault();
    openTrackMenu(row.dataset.id, row, row.dataset.context, { x: e.clientX, y: e.clientY });
  }

  function onLibraryChange(kind) {
    if (kind === "likes") {
      Views.updateLikes();
      updateLikeButtons();
      const current = Views.getRoute();
      if (current.name === "liked" || current.name === "home") refreshView();
      else Views.renderSidebarLibrary();
      return;
    }
    if (kind === "recent") {
      if (Views.getRoute().name === "home") refreshView();
      return;
    }
    refreshView(); // tracks, playlists
  }

  // ---------- Início ----------

  function init() {
    Views.fillIcons(document);
    Player.init($("#audio"));
    Player.on("track", onTrack);
    Player.on("state", onState);
    Player.on("time", onTime);
    Library.onChange(onLibraryChange);

    setupFileInputs();
    setupRanges();
    setupFullscreenGesture();

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("contextmenu", onContextMenu);
    $("#menu-backdrop").addEventListener("click", closeMenu);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("hashchange", route);

    onState(Player.getState());
    updateLikeButtons();
    route();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { init, addFiles, toast };
})();
