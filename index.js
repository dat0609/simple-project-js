
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE = "PLAYER"

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const btnPlay = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.stringify(localStorage.getItem(PLAYER_STORAGE)) || {},
    songs: [
        {
            name: 'Salt',
            singer: 'Ava',
            path: './assets/music/Ava Max - Salt (Syn Cole Remix) [Official Audio].mp3',
            image: "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: 'Lối nhỏ',
            singer: 'Đne',
            path: './assets/music/Đen - Lối Nhỏ ft. Phương Anh Đào (MV).mp3',
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: 'Đi về nhà',
            singer: 'Đen',
            path: './assets/music/Đen x JustaTee - Đi Về Nhà (MV).mp3',
            image: "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: 'Lemon tree',
            singer: 'Fools',
            path: './assets/music/Lemon Tree - Fools Garden.mp3',
            image: "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: 'Maps',
            singer: 'Maroon 5',
            path: './assets/music/Maroon 5 - Maps (Lyric Video).mp3',
            image: "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
        },
        {
            name: 'Memories',
            singer: 'Maroon 5',
            path: './assets/music/Maroon 5 - Memories (Official Video).mp3',
            image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        },
    ],
    // setConfig: function (key, value) {
    //     this.config[key] = value;
    //     localStorage.setItem(PLAYER_STORAGE, JSON.parse(this.config))
    // },
    defineProperty: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function () {
        const html = this.songs.map((song, index) => {
            return `        
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>  
            </div>
        `
        })
        playlist.innerHTML = html.join('')
    },
    handleEvent: function () {
        const _this = this
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth
        // scrolling 
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        }
        //play handle
        btnPlay.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //play state
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdRotate.play()
        }
        //pause state
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdRotate.pause()
        }
        // song on process
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // seeking song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // cd rotate
        const cdRotate = cdThumb.animate([
            { transform: 'rotate(360deg' }
        ], {
            duration: 10000,
            iteration: Infinity
        }
        )
        cdRotate.pause()
        // next song
        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }
        // prev song
        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }
        // random
        btnRandom.onclick = function () {
            _this.isRandom = !_this.isRandom
            // _this.setConfig('isRandom', _this.isRandom)
            btnRandom.classList.toggle('active', _this.isRandom)
        }
        // repeat
        btnRepeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            // _this.setConfig('isRepeat', _this.isRepeat)
            btnRepeat.classList.toggle('active', _this.isRepeat)
        }
        // song ended
        audio.onended = function () {
            if (_this.isRepeat) audio.play()
            else btnNext.click();
        }
        // play song on playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) this.currentIndex = 0
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    start: function () {

        this.defineProperty()
        this.render();
        this.loadCurrentSong()
        this.handleEvent();
    },

}
app.start()