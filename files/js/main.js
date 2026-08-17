/**
 * Language Learning Hub - Main JavaScript
 * Handles menu interactions and dynamic content loading
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    initializeContentLinks();
    initializeNestedMenus();
});

/**
 * Initialize accordion menu functionality
 */
function initializeMenu() {
    const menuButtons = document.querySelectorAll('.menu-button');
    
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const isActive = menuItem.classList.contains('active');
            
            // Close all other menus
            document.querySelectorAll('.menu-item.active').forEach(item => {
                if (item !== menuItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current menu
            menuItem.classList.toggle('active', !isActive);
        });
    });
}

/**
 * Initialize submenu link click handlers
 */
function initializeContentLinks() {
    const submenuLinks = document.querySelectorAll('.submenu-link');
    
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            document.querySelectorAll('.submenu-link.active').forEach(l => {
                l.classList.remove('active');
            });
            this.classList.add('active');
            
            // Get content identifier
            const contentId = this.dataset.content;
            const contentTitle = this.textContent;
            
            // Load content
            loadContent(contentId, contentTitle);
        });
    });
}


/**
 * Initialize nested (3rd-level) submenu group toggles
 */
function initializeNestedMenus() {
    document.querySelectorAll('.submenu-group-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const group = this.closest('.submenu-group');
            group.classList.toggle('open');
        });
    });
}

/**
 * Load content into the main content area
 * @param {string} contentId - The content identifier
 * @param {string} title - The content title
 */
async function loadContent(contentId, title) {
    const contentArea = document.getElementById('contentArea');
    
    // Get content based on ID (you can expand this with actual content)
    const content = await getContentById(contentId, title);
    
    // Update content area with fade effect
    contentArea.style.opacity = '0';
    
    setTimeout(() => {
        contentArea.innerHTML = content;
        contentArea.style.opacity = '1';
        
        // Wire up flashcard interactivity if present
        initFlashcard();

        // Scroll to top of content
        contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
}

/**
 * Get content HTML by content ID
 * This is a sample implementation - replace with actual content or API calls
 * @param {string} contentId - The content identifier
 * @param {string} title - The content title
 * @returns {string} HTML content
 */
async function getContentById(contentId, title) {
    // Detect current language from body class
    const isTeluguPage = document.body.classList.contains('telugu-theme');
    const isSanskritPage = document.body.classList.contains('sanskrit-theme');
    
    // Sample content templates - expand these with your actual content
    const contentTemplates = {
        // Telugu content
        'introduction': isTeluguPage ? getTeluguIntroContent() : getSanskritIntroContent(),
        'history': getHistoryContent(isTeluguPage),
        'vowels': isTeluguPage ? getTeluguVowelsContent() : getSanskritVowelsContent(),
        'telugu-vowels': getTeluguVowelsContent(),
        'telugu-consonants': getTeluguConsonantsContent(),
        'achhulu-gunintalu': await getTeluguAchhuluGunintaaluContent(),
        'hallulu-ottulu': await getTeluguHalluluOttuluContent(),
        'telugu-words-simple': await getTeluguWordsSimpleContent(),
        'telugu-words-gunintaalu': await getTeluguWordsGunintaaluContent(),
        'telugu-words-vottulu': await getTeluguWordsVottuluContent(),
		'telugu-words-complex': await getTeluguWordsComplexContent(),
        
        'sets-opposites': await getTeluguSetsOppositesContent(),
        'telugu-karta-karma-kriya': await getTeluguKartaKarmaKriyaContent(),
        'telugu-verb-tenses': await getTeluguVerbTensesContent(),
        'telugu-verbs-nenu': await getTeluguVerbNenuContent(),
        'telugu-verb-manamu': await getTeluguVerbManamuContent(),
        'telugu-verb-nuvvu': await getTeluguVerbNuvvuContent(),
        
        'telugu-reads-deepavali': await getTeluguReadsDeepavaliContent(),
        'telugu-reads-ugaadi': await getTeluguReadsUgaadiContent(),
        'telugu-reads-sankranti': await getTeluguReadsSankrantiContent(),
        'consonants': isTeluguPage ? getTeluguConsonantsContent() : getSanskritConsonantsContent(),
        
        'numbers': getNumbersContent(isTeluguPage),
        'telugu-ankelu-kaalalu': getNumbersTimeContent(),
        'telugu-birds': await getTeluguBirdsContent(),
        'telugu-animals': await getTeluguAnimalsContent(),
        'telugu-insects': await getTeluguInsectsContent(),
        'telugu-colors': getTeluguColorsContent(),
        'greetings': getGreetingsContent(isTeluguPage),
        
        'basic-shlokas': getBasicShlokasContent(),
        'basic-words': getSanskritBasicWordsContent(),
        'avyaya': getSanskritAvyayaWordsContent(),
        'learnInSets': getSanskritLearnInSetsContent(),
        
        'verb-read': await getSanskritVerbReadContent(),
        'verb-go': await getSanskritVerbGoContent(),
        'verb-see': await getSanskritVerbSeeContent(),
        
        'telugu-reads-deepavali': await getTeluguReadsDeepavaliContent(),
        'telugu-reads-ugaadi': await getTeluguReadsUgaadiContent(),
        'telugu-reads-sankranti': await getTeluguReadsSankrantiContent(),
        
        'swaras': getSanskritVowelsContent(),
        'vyanjanas': getSanskritConsonantsContent(),
        'sanskrit-reads-deepavali': await getSanskritReadsDeepavaliContent(),
        'sanskrit-reads-ugaadi': await getSanskritReadsUgaadiContent(),
        'sanskrit-reads-sankranti': await getSanskritReadsSankrantiContent(),

        'Ganapati-Slokam': await getGanapatiSlokamContent(),

        'sangeetam-intro': await getSangeetamIntroContent(),
		'sarali-swaramulu': await getSaraliSwaramuluContent(),
        'Alankaramulu': await getAlankaramuluContent(),

        'Keerayu': await getN_KeerayuContent(),
        'RamaJanardhana': await getN_RamaJanardhanaContent(),
        'RaminchuvaaRevaruraa': await getN_RaminchuvaaRevaruraaContent(),
        'SakthiSahitaGanapatim': await getN_SakthiSahitaGanapatimContent(),
        'SantamPaahimaam': await getN_SantamPaahimaamContent(),
        'syamaleMeenakshi': await getN_SyamaleMeenakshiContent(),
        'VandeMeenakshi': await getN_VandeMeenakshiContent(),
        'VaraShivaBalam': await getN_VarashivaBalamContent(),

        'kundaGoura': await getG_KundaGouraContent(),
        'sriGananadha': await getG_SriGananadhaContent(),
        'VaraVeena': await getG_VaraVeenaContent(),

        'AdigoBhadraadri': await getK_AdigoBhadraadriContent(),
        'SitaKalyanaVaibhogame': await getK_SitaKalyanaVaibhogameContent(),
        'RamaChandraaya': await getK_RamaChandraayaContent(),
        'muddugaareYashoda': await getK_muddugaareYashodaContent(),

        'O_harivarasanam': await getO_HariVasarasanamContent(),
        'O_Lingaastakam': await getO_LingaastakamContent(),
        'O_ramaChandraya': await getO_RamaChandrayaContent(),

        'MS_maatemantramu': await getMS_maatemantramuContent(),
        'MS_yedutanilichindi_choodu': await getMS_yedutanilichindi_chooduContent(),
    };
    
    // Return specific content or generate placeholder
    return contentTemplates[contentId] || getPlaceholderContent(title, contentId);
}

/**
 * Telugu Introduction Content
 */
function getTeluguIntroContent() {
    return `
        <div class="lesson-content">
            <header class="lesson-header">
                <h1>Introduction to Telugu</h1>
                <div class="lesson-meta">
                    <span>📚 Beginner</span>
                    <span>⏱️ 10 min read</span>
                </div>
            </header>
            
            <div class="lesson-body">
                <p>Telugu (తెలుగు) is a Dravidian language spoken predominantly in the Indian states of Andhra Pradesh and Telangana. With over 83 million native speakers, it is one of the most widely spoken languages in India.</p>
                
                <div class="example-box">
                    <div class="native">తెలుగు భాష అందమైనది</div>
                    <div class="transliteration">Telugu bhāṣa andamainadi</div>
                    <div class="meaning">"The Telugu language is beautiful"</div>
                </div>
                
                <h2>Why Learn Telugu?</h2>
                <ul>
                    <li><strong>Rich Literary Heritage:</strong> Telugu has a vast collection of poetry, literature, and classical works dating back over 2000 years.</li>
                    <li><strong>Cultural Connection:</strong> Understanding Telugu opens doors to the rich traditions, music, and cinema of Telugu-speaking regions.</li>
                    <li><strong>The Italian of the East:</strong> Telugu is known for its melodious quality, with every word ending in a vowel sound.</li>
                    <li><strong>Growing Importance:</strong> With a large diaspora and thriving entertainment industry, Telugu is increasingly relevant globally.</li>
                </ul>
                
                <h2>Language Characteristics</h2>
                <p>Telugu belongs to the South-Central Dravidian family of languages. Here are some key characteristics:</p>
                
                <h3>Phonetic Nature</h3>
                <p>Telugu is highly phonetic—words are pronounced exactly as they are written. This makes it relatively easy to read once you learn the script.</p>
                
                <h3>Vowel-Ending Words</h3>
                <p>Almost all Telugu words end in a vowel sound, giving the language its musical quality. This feature earned it the nickname "Italian of the East."</p>
                
                <h3>Agglutinative Structure</h3>
                <p>Telugu is an agglutinative language, meaning grammatical relations are expressed by adding suffixes to words rather than using separate words.</p>
                
                <div class="tip-box">
                    <span class="tip-icon">💡</span>
                    <div class="tip-content">
                        <strong>Learning Tip:</strong> Start by familiarizing yourself with the sounds of Telugu by listening to Telugu songs or movies. This will help your pronunciation even before you learn to read.
                    </div>
                </div>
            </div>
            
            <nav class="lesson-nav">
                <span></span>
                <a href="#" class="nav-btn next" data-content="history">
                    Next: History & Origin
                    <span>→</span>
                </a>
            </nav>
        </div>
    `;
}

/**
 * Sanskrit Introduction Content
 */
function getSanskritIntroContent() {
    return `
        <div class="lesson-content">
            <header class="lesson-header">
                <h1>Introduction to Sanskrit</h1>
                <div class="lesson-meta">
                    <span>📚 Beginner</span>
                    <span>⏱️ 12 min read</span>
                </div>
            </header>
            
            <div class="lesson-body">
                <p>Sanskrit (संस्कृतम्) is one of the oldest languages in the world and holds a unique position as the classical language of India. Known as "Deva Bhasha" (language of the gods), Sanskrit is the liturgical language of Hinduism, Buddhism, and Jainism.</p>
                
                <div class="example-box">
                    <div class="native">संस्कृतं नाम दैवी वाक्</div>
                    <div class="transliteration">Saṃskṛtaṃ nāma daivī vāk</div>
                    <div class="meaning">"Sanskrit is indeed the divine language"</div>
                </div>
                
                <h2>Why Learn Sanskrit?</h2>
                <ul>
                    <li><strong>Access to Ancient Wisdom:</strong> Read the Vedas, Upanishads, Bhagavad Gita, and countless philosophical texts in their original form.</li>
                    <li><strong>Scientific Grammar:</strong> Sanskrit's grammar, codified by Panini in the 4th century BCE, is considered one of humanity's greatest intellectual achievements.</li>
                    <li><strong>Linguistic Foundation:</strong> Sanskrit is the root of many Indian languages and has influenced languages across Asia and Europe.</li>
                    <li><strong>Mental Discipline:</strong> Learning Sanskrit develops logical thinking and precision in language use.</li>
                </ul>
                
                <h2>Language Structure</h2>
                <p>Sanskrit is known for its precise and scientific structure:</p>
                
                <h3>Perfect Phonetic System</h3>
                <p>The Sanskrit alphabet (Varnamala) is organized scientifically based on the point of articulation in the mouth—from the throat to the lips.</p>
                
                <h3>Rich Morphology</h3>
                <p>Sanskrit uses an elaborate system of prefixes, suffixes, and compound words to express complex ideas with precision.</p>
                
                <h3>Eight Cases (Vibhaktis)</h3>
                <p>Sanskrit nouns decline in eight cases, allowing for flexible word order while maintaining clear meaning.</p>
                
                <div class="tip-box">
                    <span class="tip-icon">💡</span>
                    <div class="tip-content">
                        <strong>Learning Tip:</strong> Begin with the Devanagari script and pronunciation. Sanskrit's phonetic nature means that perfect pronunciation is both achievable and essential.
                    </div>
                </div>
            </div>
            
            <nav class="lesson-nav">
                <span></span>
                <a href="#" class="nav-btn next" data-content="history">
                    Next: History & Significance
                    <span>→</span>
                </a>
            </nav>
        </div>
    `;
}

/**
 * Sanskrit Vowels Content
 */
function getSanskritVowelsContent() {
    return `
        <div class="lesson-content">
            <header class="lesson-header">
                <h1>Swaras (स्वर) - Vowels</h1>
                <div class="lesson-meta">
                    <span>📚 Varnamala</span>
                    <span>⏱️ 15 min</span>
                </div>
            </header>
            
            <div class="lesson-body">
                <p>Sanskrit has 13 vowels called <strong>स्वर (Swara)</strong>. The term "swara" literally means "that which shines by itself"—vowels can be pronounced independently without the help of consonants.</p>
                
                <h2>Primary Vowels (मूल स्वर)</h2>
                
                <div class="character-grid">
                    <div class="character-card">
                        <span class="char">अ</span>
                        <span class="romanized">a</span>
                    </div>
                    <div class="character-card">
                        <span class="char">आ</span>
                        <span class="romanized">ā</span>
                    </div>
                    <div class="character-card">
                        <span class="char">इ</span>
                        <span class="romanized">i</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ई</span>
                        <span class="romanized">ī</span>
                    </div>
                    <div class="character-card">
                        <span class="char">उ</span>
                        <span class="romanized">u</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ऊ</span>
                        <span class="romanized">ū</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ऋ</span>
                        <span class="romanized">ṛ</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ॠ</span>
                        <span class="romanized">ṝ</span>
                    </div>
                </div>
                
                <h2>Compound Vowels (संयुक्त स्वर)</h2>
                
                <div class="character-grid">
                    <div class="character-card">
                        <span class="char">ए</span>
                        <span class="romanized">e</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ऐ</span>
                        <span class="romanized">ai</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ओ</span>
                        <span class="romanized">o</span>
                    </div>
                    <div class="character-card">
                        <span class="char">औ</span>
                        <span class="romanized">au</span>
                    </div>
                </div>
                
                <h2>Articulation Points</h2>
                <div class="example-box">
                    <p><strong>कण्ठ्य (Throat):</strong> अ, आ</p>
                    <p><strong>तालव्य (Palate):</strong> इ, ई</p>
                    <p><strong>ओष्ठ्य (Lips):</strong> उ, ऊ</p>
                    <p><strong>मूर्धन्य (Roof):</strong> ऋ, ॠ</p>
                </div>
                
                <div class="tip-box">
                    <span class="tip-icon">💡</span>
                    <div class="tip-content">
                        <strong>Sanskrit Insight:</strong> The vowel ऋ (ṛ) is unique to Sanskrit and is pronounced as a soft "ri" sound. It appears in many common words like ऋषि (ṛṣi - sage).
                    </div>
                </div>
            </div>
            
            <nav class="lesson-nav">
                <a href="#" class="nav-btn prev" data-content="devanagari">
                    <span>←</span>
                    Previous: Devanagari Script
                </a>
                <a href="#" class="nav-btn next" data-content="vyanjanas">
                    Next: Consonants
                    <span>→</span>
                </a>
            </nav>
        </div>
    `;
}


/**
 * Sanskrit Consonants Content
 */
function getSanskritConsonantsContent() {
    return `
        <div class="lesson-content">
            <header class="lesson-header">
                <h1>Vyanjanas (व्यञ्जन) - Consonants</h1>
                <div class="lesson-meta">
                    <span>📚 Varnamala</span>
                    <span>⏱️ 25 min</span>
                </div>
            </header>
            
            <div class="lesson-body">
                <p>Sanskrit has 33 consonants called <strong>व्यञ्जन (Vyanjana)</strong>. They are systematically organized based on their point of articulation.</p>
                
                <h2>Varga Consonants (वर्ग व्यञ्जन)</h2>
                <p>These are arranged in 5 groups of 5, based on where in the mouth they are pronounced:</p>
                
                <h3>कवर्ग (Kavarga) - Velar</h3>
                <div class="character-grid">
                    <div class="character-card">
                        <span class="char">क</span>
                        <span class="romanized">ka</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ख</span>
                        <span class="romanized">kha</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ग</span>
                        <span class="romanized">ga</span>
                    </div>
                    <div class="character-card">
                        <span class="char">घ</span>
                        <span class="romanized">gha</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ङ</span>
                        <span class="romanized">ṅa</span>
                    </div>
                </div>
                
                <h3>चवर्ग (Cavarga) - Palatal</h3>
                <div class="character-grid">
                    <div class="character-card">
                        <span class="char">च</span>
                        <span class="romanized">ca</span>
                    </div>
                    <div class="character-card">
                        <span class="char">छ</span>
                        <span class="romanized">cha</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ज</span>
                        <span class="romanized">ja</span>
                    </div>
                    <div class="character-card">
                        <span class="char">झ</span>
                        <span class="romanized">jha</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ञ</span>
                        <span class="romanized">ña</span>
                    </div>
                </div>
                
                <h3>टवर्ग (Ṭavarga) - Retroflex</h3>
                <div class="character-grid">
                    <div class="character-card">
                        <span class="char">ट</span>
                        <span class="romanized">ṭa</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ठ</span>
                        <span class="romanized">ṭha</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ड</span>
                        <span class="romanized">ḍa</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ढ</span>
                        <span class="romanized">ḍha</span>
                    </div>
                    <div class="character-card">
                        <span class="char">ण</span>
                        <span class="romanized">ṇa</span>
                    </div>
                </div>
                
                <div class="example-box">
                    <p><strong>Systematic Pattern:</strong></p>
                    <p>Each varga follows: Unvoiced → Unvoiced Aspirated → Voiced → Voiced Aspirated → Nasal</p>
                </div>
                
                <div class="tip-box">
                    <span class="tip-icon">💡</span>
                    <div class="tip-content">
                        <strong>Panini's Genius:</strong> This arrangement is over 2,500 years old and is still considered one of the most scientific phonetic systems ever devised!
                    </div>
                </div>
            </div>
            
            <nav class="lesson-nav">
                <a href="#" class="nav-btn prev" data-content="swaras">
                    <span>←</span>
                    Previous: Vowels
                </a>
                <a href="#" class="nav-btn next" data-content="matras">
                    Next: Matras
                    <span>→</span>
                </a>
            </nav>
        </div>
    `;
}

/**
 * History Content
 */
function getHistoryContent(isTelugu) {
    if (isTelugu) {
        return `
            <div class="lesson-content">
                <header class="lesson-header">
                    <h1>History & Origin of Telugu</h1>
                    <div class="lesson-meta">
                        <span>📚 Background</span>
                        <span>⏱️ 12 min read</span>
                    </div>
                </header>
                
                <div class="lesson-body">
                    <p>Telugu has a rich history spanning over two millennia. It is one of the classical languages of India, receiving this status in 2008.</p>
                    
                    <h2>Ancient Origins</h2>
                    <p>The earliest Telugu inscriptions date back to 575 CE. The language evolved from Proto-Dravidian and developed its distinct identity over centuries.</p>
                    
                    <h2>Classical Period</h2>
                    <p>The period between 11th and 14th centuries is considered the golden age of Telugu literature, with poets like Nannaya, Tikkana, and Yerrapragada translating the Mahabharata into Telugu.</p>
                    
                    <h2>Modern Telugu</h2>
                    <p>Today, Telugu is the fourth most spoken language in India and the most spoken Dravidian language in the world.</p>
                    
                    <div class="tip-box">
                        <span class="tip-icon">📜</span>
                        <div class="tip-content">
                            <strong>Did you know?</strong> The word "Telugu" itself appears in the Mahabharata as "Trilinga," referring to the region of three Shiva temples.
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="lesson-content">
                <header class="lesson-header">
                    <h1>History & Significance of Sanskrit</h1>
                    <div class="lesson-meta">
                        <span>📚 Background</span>
                        <span>⏱️ 15 min read</span>
                    </div>
                </header>
                
                <div class="lesson-body">
                    <p>Sanskrit is one of the oldest known languages, with a documented history spanning over 3,500 years. It is the primary liturgical language of Hinduism and a significant influence on many modern languages.</p>
                    
                    <h2>Vedic Period (1500-500 BCE)</h2>
                    <p>The earliest form of Sanskrit, Vedic Sanskrit, was used to compose the Vedas—the oldest scriptures of Hinduism. This period established the foundations of Indian philosophy and spirituality.</p>
                    
                    <h2>Classical Period (500 BCE onwards)</h2>
                    <p>Panini's Ashtadhyayi (4th century BCE) standardized Classical Sanskrit with 3,959 rules of grammar. This work is considered one of the greatest achievements in linguistics.</p>
                    
                    <h2>Global Influence</h2>
                    <p>Sanskrit has influenced numerous languages including Hindi, Bengali, Marathi, and even languages outside India. Many English words have Sanskrit origins.</p>
                    
                    <div class="example-box">
                        <p><strong>Sanskrit-derived English words:</strong></p>
                        <p>Yoga (योग), Karma (कर्म), Nirvana (निर्वाण), Avatar (अवतार), Guru (गुरु)</p>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Numbers Content
 */
function getNumbersContent(isTelugu) {
    if (isTelugu) {
        return `
            <div class="lesson-content">
                <header class="lesson-header">
                    <h1>Telugu Numbers (సంఖ్యలు)</h1>
                    <div class="lesson-meta">
                        <span>📚 Vocabulary</span>
                        <span>⏱️ 10 min</span>
                    </div>
                </header>
                
                <div class="lesson-body">
                    <p>Learning numbers is essential for everyday conversations. Here are the Telugu numbers from 1 to 10:</p>
                    
                    <div class="character-grid">
                        <div class="character-card">
                            <span class="char">౧</span>
                            <span class="romanized">1 - ఒకటి (okaṭi)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">౨</span>
                            <span class="romanized">2 - రెండు (reṇḍu)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">౩</span>
                            <span class="romanized">3 - మూడు (mūḍu)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">౪</span>
                            <span class="romanized">4 - నాలుగు (nālugu)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">౫</span>
                            <span class="romanized">5 - ఐదు (aidu)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">౬</span>
                            <span class="romanized">6 - ఆరు (āru)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">౭</span>
                            <span class="romanized">7 - ఏడు (ēḍu)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">౮</span>
                            <span class="romanized">8 - ఎనిమిది (enimidi)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">౯</span>
                            <span class="romanized">9 - తొమ్మిది (tommidi)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">౧౦</span>
                            <span class="romanized">10 - పది (padi)</span>
                        </div>
                    </div>
                    
                    <div class="tip-box">
                        <span class="tip-icon">💡</span>
                        <div class="tip-content">
                            <strong>Practice:</strong> Try counting objects around you in Telugu!
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="lesson-content">
                <header class="lesson-header">
                    <h1>Sankhya (संख्या) - Numbers</h1>
                    <div class="lesson-meta">
                        <span>📚 Vocabulary</span>
                        <span>⏱️ 10 min</span>
                    </div>
                </header>
                
                <div class="lesson-body">
                    <p>Sanskrit numbers follow a logical pattern. Here are the numbers from 1 to 10:</p>
                    
                    <div class="character-grid">
                        <div class="character-card">
                            <span class="char">१</span>
                            <span class="romanized">1 - एकम् (ekam)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">२</span>
                            <span class="romanized">2 - द्वे (dve)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">३</span>
                            <span class="romanized">3 - त्रीणि (trīṇi)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">४</span>
                            <span class="romanized">4 - चत्वारि (catvāri)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">५</span>
                            <span class="romanized">5 - पञ्च (pañca)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">६</span>
                            <span class="romanized">6 - षट् (ṣaṭ)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">७</span>
                            <span class="romanized">7 - सप्त (sapta)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">८</span>
                            <span class="romanized">8 - अष्ट (aṣṭa)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">९</span>
                            <span class="romanized">9 - नव (nava)</span>
                        </div>
                        <div class="character-card">
                            <span class="char">१०</span>
                            <span class="romanized">10 - दश (daśa)</span>
                        </div>
                    </div>
                    
                    <div class="example-box">
                        <p><strong>Notice the connections:</strong></p>
                        <p>पञ्च (5) → penta (Greek), five (English)</p>
                        <p>सप्त (7) → sept (Latin), seven (English)</p>
                        <p>नव (9) → novem (Latin), nine (English)</p>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Greetings Content
 */
function getGreetingsContent(isTelugu) {
    if (isTelugu) {
        return `
            <div class="lesson-content">
                <header class="lesson-header">
                    <h1>Telugu Greetings (అభివాదాలు)</h1>
                    <div class="lesson-meta">
                        <span>📚 Conversations</span>
                        <span>⏱️ 8 min</span>
                    </div>
                </header>
                
                <div class="lesson-body">
                    <h2>Basic Greetings</h2>
                    
                    <div class="example-box">
                        <div class="native">నమస్కారం</div>
                        <div class="transliteration">Namaskāram</div>
                        <div class="meaning">Hello / Greetings (formal)</div>
                    </div>
                    
                    <div class="example-box">
                        <div class="native">బాగున్నారా?</div>
                        <div class="transliteration">Bāgunnārā?</div>
                        <div class="meaning">How are you? (formal)</div>
                    </div>
                    
                    <div class="example-box">
                        <div class="native">బాగున్నావా?</div>
                        <div class="transliteration">Bāgunnāvā?</div>
                        <div class="meaning">How are you? (informal)</div>
                    </div>
                    
                    <div class="example-box">
                        <div class="native">నేను బాగున్నాను</div>
                        <div class="transliteration">Nēnu bāgunnānu</div>
                        <div class="meaning">I am fine</div>
                    </div>
                    
                    <div class="example-box">
                        <div class="native">ధన్యవాదాలు</div>
                        <div class="transliteration">Dhanyavādālu</div>
                        <div class="meaning">Thank you</div>
                    </div>
                    
                    <div class="tip-box">
                        <span class="tip-icon">💡</span>
                        <div class="tip-content">
                            <strong>Cultural Note:</strong> "Namaskaram" is accompanied by joining both palms together, a gesture of respect.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    return getPlaceholderContent('Greetings', 'greetings');
}

/**
 * Basic Shlokas Content (Sanskrit)
 */
function getBasicShlokasContent() {
    return `
        <div class="lesson-content">
            <header class="lesson-header">
                <h1>Basic Shlokas (श्लोक)</h1>
                <div class="lesson-meta">
                    <span>📚 Texts</span>
                    <span>⏱️ 15 min</span>
                </div>
            </header>
            
            <div class="lesson-body">
                <p>Shlokas are Sanskrit verses, often with deep meaning. Here are some fundamental shlokas for beginners:</p>
                
                <h2>Ganesh Vandana</h2>
                <div class="example-box">
                    <div class="native">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥</div>
                    <div class="transliteration">Vakratuṇḍa mahākāya sūryakoṭi samaprabha |<br>Nirvighnaṃ kuru me deva sarvakāryeṣu sarvadā ||</div>
                    <div class="meaning">"O Lord with the curved trunk and massive body, whose brilliance equals a billion suns, please make all my endeavors free of obstacles, always."</div>
                </div>
                
                <h2>Saraswati Vandana</h2>
                <div class="example-box">
                    <div class="native">सरस्वति नमस्तुभ्यं वरदे कामरूपिणि।<br>विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा॥</div>
                    <div class="transliteration">Sarasvati namastubhyaṃ varade kāmarūpiṇi |<br>Vidyārambhaṃ kariṣyāmi siddhirbhavatu me sadā ||</div>
                    <div class="meaning">"O Saraswati, salutations to you, the bestower of boons. As I begin my studies, may I always achieve success."</div>
                </div>
                
                <h2>Shanti Mantra</h2>
                <div class="example-box">
                    <div class="native">ॐ सह नाववतु। सह नौ भुनक्तु।<br>सह वीर्यं करवावहै।<br>तेजस्वि नावधीतमस्तु मा विद्विषावहै।<br>ॐ शान्तिः शान्तिः शान्तिः॥</div>
                    <div class="transliteration">Om saha nāvavatu | saha nau bhunaktu |<br>Saha vīryaṃ karavāvahai |<br>Tejasvi nāvadhītamastu mā vidviṣāvahai |<br>Om śāntiḥ śāntiḥ śāntiḥ ||</div>
                    <div class="meaning">"May we both be protected. May we both be nourished. May we work together with great energy. May our study be enlightening. May we not hate each other. Om peace, peace, peace."</div>
                </div>
                
                <div class="tip-box">
                    <span class="tip-icon">💡</span>
                    <div class="tip-content">
                        <strong>Recitation Tip:</strong> Listen to audio recordings of these shlokas to learn proper pronunciation and rhythm. Sanskrit verses have a musical meter (chandas) that aids memorization.
                    </div>
                </div>
            </div>
        </div>
    `;
}

/*
getTeluguAchhuluGunintaaluContent
*/
async function getTeluguAchhuluGunintaaluContent() {
    return loadContent_md_html('md/telugu/achhulu-gunintaalu.md');
}

async function getTeluguHalluluOttuluContent() {
    return loadContent_md_html('md/telugu/telugu-vottulu.md');
}

async function getTeluguWordsSimpleContent() {
    return loadFlashcardCSV('telugu-simpleAksharaalu.csv');
}

async function getTeluguWordsGunintaaluContent() {
    return loadFlashcardCSV('telugu-gunintaaluAksharaalu.csv');
}

async function getTeluguWordsVottuluContent() {
    return loadFlashcardCSV('telugu-vottuluAksharaalu.csv');
}

async function getTeluguWordsComplexContent() {
    return loadFlashcardCSV('telugu-complexAksharaalu.csv');
}

async function getNumbersTimeContent() {
    return loadContent_md_html('md/telugu/telugu-ankelu-kaalalu.md');
}

async function getTeluguColorsContent() {
    return loadContent_md_html('md/telugu/telugu-colors.md');
}

async function getTeluguSetsOppositesContent() {
    return loadContent_md_html('md/telugu/sets-opposites.md');
}

async function getSanskritBasicWordsContent() {
    return loadContent_md_html('md/sanskrit/sanskrit-basic-words.md');
}
async function getSanskritVerbGoContent(){
    return loadContent_md_html('md/sanskrit/sanskrit-verb-go.md');
}

async function getSanskritVerbReadContent(){
    return loadContent_md_html('md/sanskrit/sanskrit-verb-read.md');
}

async function getSanskritVerbSeeContent(){
    return loadContent_md_html('md/sanskrit/sanskrit-verb-see.md');
}

async function getTeluguKartaKarmaKriyaContent() {
    return loadContent_md_html('md/telugu/karta-karma-kriya.md');
}

async function getTeluguVerbTensesContent(){
    return loadContent_md_html('md/telugu/telugu-verb-tenses.md');
}


async function getTeluguVerbNenuContent() {
    return loadContent_md_html('md/telugu/telugu-tense-nenu.md');
}

async function getTeluguVerbManamuContent() {
    return loadContent_md_html('md/telugu/telugu-tense-manamu.md');
}

async function getTeluguVerbNuvvuContent() {
    return loadContent_md_html('md/telugu/telugu-tense-nuvvu.md');
}

async function getTeluguReadsDeepavaliContent() {
    return loadContent_md_html('md/telugu/telugu-reads-deepavali.md');
}

async function getTeluguReadsUgaadiContent() {
    return loadContent_md_html('md/telugu/telugu-reads-ugaadi.md');
}

async function getTeluguReadsSankrantiContent() {
    return loadContent_md_html('md/telugu/telugu-reads-sankranti.md');
}

async function getSanskritLearnInSetsContent() {
    return loadContent_md_html('md/sanskrit/sanskrit-learn-in-sets.md');
}

async function getSanskritAvyayaWordsContent() {
    return loadContent_md_html('md/sanskrit/sanskrit-avyaya.md');
}

async function getSanskritReadsDeepavaliContent() {
    return loadContent_md_html('md/sanskrit/sanskrit-reads-deepavali.md');
}

async function getSanskritReadsUgaadiContent() {
    return loadContent_md_html('md/sanskrit/sanskrit-reads-ugaadi.md');
}

async function getSanskritReadsSankrantiContent() {
    return loadContent_md_html('md/sanskrit/sanskrit-reads-sankranti.md');
}

async function getTeluguBirdsContent() {
    return loadAllImages('birds.csv', 'పక్షులు', 'Next Bird', 'telugu-birds');
}

async function getTeluguAnimalsContent() {
    return loadAllImages('animals.csv', 'జంతువులు', 'Next Animal', 'telugu-animals');
}

async function getTeluguInsectsContent() {
    return loadAllImages('insects.csv', 'కీటకాలుు', 'Next Insect', 'telugu-insects');
}

async function getTeluguVowelsContent() {
    return loadContent_md_html('pages/telugu-achchulu.html');
}
async function getTeluguConsonantsContent() {
    return loadContent_md_html('pages/telugu-hallulu.html');
}

async function getGanapatiSlokamContent() {
    return loadContent_md_html('pages/GanapatiSlokam.html');
}

async function getSangeetamIntroContent() {
    return loadContent_md_html('md/sangeetam/sangeetam_intro.md');
}

async function getSaraliSwaramuluContent() {
    return loadContent_md_html('md/sangeetam/sarali_swaramulu.md');
}

async function getAlankaramuluContent() {
    return loadContent_md_html('md/sangeetam/alankaramulu.md');
}

async function getN_SyamaleMeenakshiContent() {
    return loadContent_md_html('md/sangeetam/N_SyamaleMeenakshi.md');
}

async function getN_VandeMeenakshiContent() {
    return loadContent_md_html('md/sangeetam/N_VandeMeenakshi.md');
}

async function getN_RaminchuvaaRevaruraaContent() {
    return loadContent_md_html('md/sangeetam/N_RaminchuvaaRevarura.md');
}

async function getN_VarashivaBalamContent() {
    return loadContent_md_html('md/sangeetam/N_VarashivaBalam.md');
}

async function getN_SakthiSahitaGanapatimContent() {
    return loadContent_md_html('md/sangeetam/N_SakthiSahitaGanapatim.md');
}

async function getN_KeerayuContent() {
    return loadContent_md_html('md/sangeetam/N_KerayuNeeranu.md');
}

async function getN_SantamPaahimaamContent() {
    return loadContent_md_html('md/sangeetam/N_Santhatham pAhimAm.md');
}

async function getN_RamaJanardhanaContent() {
    return loadContent_md_html('md/sangeetam/N_RamaJanardhana.md');
}

async function getG_VaraVeenaContent() {
    return loadContent_md_html('md/sangeetam/G_Varaveena.md');
}

async function getG_KundaGouraContent() {
    return loadContent_md_html('md/sangeetam/G_KundaGoura.md');
}

async function getG_SriGananadhaContent() {
    return loadContent_md_html('md/sangeetam/G_SriGananadha.md');
}

async function getK_AdigoBhadraadriContent() {
    return loadContent_md_html('md/sangeetam/K_AdigoBhadradri.md');
}

async function getK_RamaChandraayaContent() {
    return loadContent_md_html('md/sangeetam/K_RamaChandraaya.md');
}

async function getK_SitaKalyanaVaibhogameContent() {
    return loadContent_md_html('md/sangeetam/K_SitaKalyanaVaibogame.md');
}

async function getK_SitaKalyanaVaibhogameContent() {
    return loadContent_md_html('md/sangeetam/K_SitaKalyanaVaibogame.md');
}

async function getK_muddugaareYashodaContent() {
    return loadContent_md_html('md/sangeetam/K_muddugaareYashoda.md');
}

async function getO_LingaastakamContent() {
    return loadContent_md_html('md/sangeetam/O_Lingaastakam.md');
}

async function getO_RamaChandrayaContent() {
    return loadContent_md_html('md/sangeetam/O_Ramachanraya.md');
}

async function getO_HariVasarasanamContent() {
    return loadContent_md_html('md/sangeetam/O_Harivarasanam.md');
}

async function getMS_maatemantramuContent() {
    return loadContent_md_html('md/sangeetam/MS_maatemantramu.md');
}

async function getMS_yedutanilichindi_chooduContent() {
    return loadContent_md_html('md/sangeetam/MS_yedutanilichindi_choodu.md');
}


async function loadContent_md_html(fileName) {
    try {
        const response = await fetch(`${fileName}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${fileName}: ${response.status}`);
        }

        const text = await response.text();

        // 👉 Detect file type
        if (fileName.endsWith('.md')) {
            return marked.parse(text);   // Markdown → HTML
        } else {
            return text;                 // HTML → render directly
        }

    } catch (err) {
        console.error(`Error loading file: ${err.message}`);
        return "<p>Error loading content</p>";
    }
}

async function loadAllImages(fileName, imgCategory, btnName, loadImageContent) {
  try {
    const response = await fetch(`csv/${fileName}`);
    const text = await response.text();

    const rows = parseCSV(text).filter(r => r[0] && r[0].trim() !== '');
    const dataRows = rows.slice(1); // skip header row

    const tableRows = dataRows.map(row => {
      const imageFile = row[0] ? row[0].trim() : '';
      const nameEn    = row[1] ? row[1].trim() : '';
      const nameTe    = row[2] ? row[2].trim() : '';
      const details   = row[4] ? `${row[4].trim()} --> *${nameTe}*` : '';

      return `
        <tr>
          <td class="showTell-td-english"  font-size= 16px>${details}</td>
        </tr>
        <tr>
          <td class="showTell-td-img" rowspan="2">
            <img src="images/${imageFile}" alt="${nameEn}" class="showTell-img" />
          </td>
          <td class="showTell-td-telugu" font-size= 32px>${nameTe}</td>
        </tr>
        <tr>
          <td class="showTell-td-english"  font-size= 16px>${nameEn}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="showTell-card">
        <table class="showTell-table">
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;

  } catch (err) {
    console.error(err);
    return `<p style="color:red;">Error loading data from csv/${fileName}. Make sure the file exists.</p>`;
  }
}

async function loadImage(fileName, imgCategory, btnName, loadImageContent) {
  try {
    const response = await fetch(`csv/${fileName}`);
    const text = await response.text();

    const rows = parseCSV(text).filter(r => r[0] && r[0].trim() !== '');
    const dataRows = rows.slice(1); // skip header row
    const row = dataRows[Math.floor(Math.random() * dataRows.length)];

    const imageFile = row[0] ? row[0].trim() : '';
    const nameEn    = row[1] ? row[1].trim() : '';
    const nameTe    = row[2] ? row[2].trim() : '';
    const details   = row[4] ? row[4].trim() : '';

    return `
      <div class="showTell-card">
        <div class="showTell-top">
          <div class="showTell-image-wrap">
            <img src="images/${imageFile}" alt="${nameTe}" class="showTell-img" />
          </div>
          <div class="showTell-names">
            <div class="showTell-telugu">${nameTe}</div>
            <div class="showTell-english">${nameEn}</div>
          </div>
          <div class="showTell-image-wrap">
            <div class="showTell-telugu">${details}</div>
          </div>
        </div>
        <button onclick="loadContent('${loadImageContent}', '${imgCategory}')" class="showTell-next-btn">🔄 ${btnName}</button>
      </div>
    `;

  } catch (err) {
    console.error(err);
    return `<p style="color:red;">Error loading data from csv/${fileName}. Make sure the file exists.</p>`;
  }
}

function parseCSV(text) {
  const rows = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = [];
    let cur = '', inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { cols.push(cur); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur);
    rows.push(cols);
  }
  return rows;
}

/*
async function loadmd(fileName){
    try {
        const response = await fetch(`${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to load "${fileName}": HTTP ${response.status}`);
        } else {
            const text = await response.text();
            return marked.parse(text);
        }
    } catch (err) {
        console.error(err);
        return "<p>Error loading content</p>";
    }
}
*/

// ---------- FLASHCARD FEATURE ---------- //
async function loadFlashcardCSV(fileName) {
    try {
        const response = await fetch(`csv/${fileName}`);
        const text = await response.text();

        const flashcardData = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);

        if (flashcardData.length === 0) {
            return `<div class="lesson-content"><p>No data in CSV.</p></div>`;
        }

        const randomIndex = Math.floor(Math.random() * flashcardData.length);
        const firstCard = renderFlashcardHTML(flashcardData[randomIndex]);

        // Encode data onto the container element via a data attribute
        const encoded = encodeURIComponent(JSON.stringify(flashcardData));

        return `
            <div class="lesson-content">
                <div id="flashcard-container" data-flashcards="${encoded}">
                    <div id="flashcard" class="flashcard">${firstCard}</div>
                    <button id="new-flashcard" class="flashcard-btn">Next</button>
                </div>
            </div>
        `;

    } catch (error) {
        console.error("Error loading CSV:", error);
        return `<div class="lesson-content"><p>Error loading flashcard data.</p></div>`;
    }
}

function renderFlashcardHTML(line) {
    const commaIndex = line.indexOf(",");
    if (commaIndex === -1) {
        return `<span class="flashcard-word">${line}</span>`;
    }
    const word = line.slice(0, commaIndex).trim();
    const translation = line.slice(commaIndex + 1).trim();
    return `<span class="flashcard-word">${word}</span><span class="flashcard-translation">${translation}</span>`;
}

function initFlashcard() {
    const btn = document.getElementById("new-flashcard");
    const container = document.getElementById("flashcard-container");
    if (!btn || !container) return;

    // Read data from the element itself — no global variable
    const flashcardData = JSON.parse(decodeURIComponent(container.dataset.flashcards));

    btn.addEventListener("click", function() {
        const randomIndex = Math.floor(Math.random() * flashcardData.length);
        document.getElementById("flashcard").innerHTML = renderFlashcardHTML(flashcardData[randomIndex]);
    });
}

/**
 * Placeholder content for sections not yet implemented
 */
function getPlaceholderContent(title, contentId) {
    return `
        <div class="lesson-content">
            <header class="lesson-header">
                <h1>${title}</h1>
                <div class="lesson-meta">
                    <span>📚 Coming Soon</span>
                </div>
            </header>
            
            <div class="lesson-body">
                <div class="tip-box">
                    <span class="tip-icon">🚧</span>
                    <div class="tip-content">
                        <strong>Content Coming Soon!</strong><br>
                        This section is currently being developed. Check back soon for comprehensive lessons on ${title.toLowerCase()}.
                    </div>
                </div>
                
                <p style="margin-top: 2rem; color: var(--color-gray-500);">
                    In the meantime, explore other sections from the menu to continue your learning journey.
                </p>
            </div>
        </div>
    `;
}

// Add event delegation for dynamically created navigation buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.nav-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.nav-btn');
        const contentId = btn.dataset.content;
        if (contentId) {
            loadContent(contentId, contentId);
        }
    }
});

document.querySelectorAll('#contentArea table').forEach(table => {
    table.classList.add('styled-table');
});

marked.setOptions({
    gfm: true,   // GitHub Flavored Markdown
    breaks: true
});