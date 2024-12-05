document.addEventListener('DOMContentLoaded', async () => {
    const awardsContainer = document.getElementById('awards-container');

    try {
        // ユーザーIDを取得
        const userId = await getUserId();

        // サーバーからアチーブメントデータを取得
        const awardsData = await fetch('/achievements-handler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
        }).then(res => res.json());

        // アチーブメントカードを生成
        let rowDiv = null;
        awardsData.forEach((award, index) => {
            // 新しい行を作成（3つ目のカード後に改行）
            if (index % 3 === 0) {
                rowDiv = document.createElement('div');
                rowDiv.classList.add('row');
                awardsContainer.appendChild(rowDiv);
            }

            const awardCard = document.createElement('div');
            awardCard.classList.add('award-card');
            if (!award.achieved_at) {
                awardCard.classList.add('locked');
            }

            // カード内容を画像のみに
            awardCard.innerHTML = `
                <img src="${award.image_url || '/default-image.png'}" alt="${award.name}" class="award-image">
            `;
            rowDiv.appendChild(awardCard);

            // クリックイベントで詳細ポップアップを表示
            awardCard.addEventListener('click', () => {
                showPopup(award);
            });
        });
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
});

// ポップアップ表示関数
function showPopup(award) {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');

    // ポップアップに詳細情報を表示
    popupContent.innerHTML = `
        <h3>${award.name}</h3>
        <p>${award.description}</p>
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${(award.progress / award.goal) * 100}%"></div>
        </div>
        <button id="close-popup">閉じる</button>
    `;

    // ポップアップを表示
    popup.style.display = 'block';

    // 閉じるボタンの処理
    const closeButton = document.getElementById('close-popup');
    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

// ユーザーIDを取得
async function getUserId() {
    try {
        const response = await fetch('/session-handler');
        const data = await response.json();
        return data.user_id;
    } catch (error) {
        console.error('Error fetching user ID:', error);
        throw error;
    }
}
