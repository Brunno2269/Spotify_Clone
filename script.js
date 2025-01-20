// ==================== Configuração dos Modais ====================
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const closeButtons = document.querySelectorAll('.close');

// Abrir modais
loginButton.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

registerButton.addEventListener('click', () => {
    registerModal.style.display = 'block';
});

// Fechar modais
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    });
});

// Fechar modais ao clicar fora
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// Simulação de login e registro
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Login realizado com sucesso!');
    loginModal.style.display = 'none';
});

document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Registro realizado com sucesso!');
    registerModal.style.display = 'none';
});

// ==================== Spotify Web Playback SDK ====================
window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'SEU_TOKEN_DE_ACESSO'; // Substitua pelo token de acesso válido
    if (!token) {
        console.error('Token de acesso não encontrado.');
        return;
    }

    const player = new Spotify.Player({
        name: 'Spotify Clone',
        getOAuthToken: cb => { cb(token); }
    });

    // Conectar ao player
    player.connect().then(success => {
        if (success) {
            console.log('Player conectado com sucesso!');
        }
    });

    // Listener para quando o player estiver pronto
    player.addListener('ready', ({ device_id }) => {
        console.log('Dispositivo pronto!');
        document.getElementById('now-playing').textContent = 'Pronto para reproduzir';
    });

    // Listener para mudanças no estado do player
    player.addListener('player_state_changed', state => {
        if (state) {
            const track = state.track_window.current_track;
            document.getElementById('now-playing').textContent = `Tocando: ${track.name} - ${track.artists[0].name}`;
        }
    });

    // Controles do player
    document.getElementById('play-button').addEventListener('click', () => {
        player.togglePlay();
    });

    document.getElementById('prev-button').addEventListener('click', () => {
        player.previousTrack();
    });

    document.getElementById('next-button').addEventListener('click', () => {
        player.nextTrack();
    });
};

// ==================== Pesquisa de Músicas ====================
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    const token = 'SEU_TOKEN_DE_ACESSO'; // Substitua pelo token de acesso válido

    if (!query || !token) {
        alert('Por favor, insira um termo de pesquisa e verifique o token.');
        return;
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar músicas.');
        }

        const data = await response.json();
        const tracks = data.tracks.items;

        const musicCards = document.getElementById('music-cards');
        musicCards.innerHTML = ''; // Limpa os resultados anteriores

        tracks.forEach(track => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${track.album.images[0].url}" alt="${track.name}">
                <h3>${track.name}</h3>
                <p>${track.artists[0].name}</p>
            `;
            musicCards.appendChild(card);
        });
    } catch (error) {
        console.error('Erro na pesquisa:', error);
        alert('Erro ao buscar músicas. Tente novamente.');
    }
});

// ==================== Obter e Exibir Playlists ====================
const getUserPlaylists = async (token) => {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar playlists.');
        }

        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Erro ao carregar playlists:', error);
        return [];
    }
};

const displayPlaylists = async () => {
    const token = 'SEU_TOKEN_DE_ACESSO'; // Substitua pelo token de acesso válido
    if (!token) {
        console.error('Token de acesso não encontrado.');
        return;
    }

    const playlists = await getUserPlaylists(token);
    const playlistList = document.getElementById('playlist-list');
    playlistList.innerHTML = ''; // Limpa a lista de playlists

    playlists.forEach(playlist => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#">${playlist.name}</a>`;
        playlistList.appendChild(li);
    });
};

// Inicializar
displayPlaylists();