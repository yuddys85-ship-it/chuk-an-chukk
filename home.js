/* =====================================
   CHUK AN CHUKK
   HOME.JS
   HOME FEED / POSTINGAN
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const feed = document.getElementById("homeFeed");
    const loading = document.getElementById("homeLoading");
    const empty = document.getElementById("homeEmpty");

    if (!feed) {
        console.error("Home Feed tidak ditemukan.");
        return;
    }

    function showLoading(show) {
        if (loading) {
            loading.style.display = show ? "block" : "none";
        }
    }

    function showEmpty(show) {
        if (empty) {
            empty.style.display = show ? "block" : "none";
        }
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function isVideo(url) {
        return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);
    }

    function createPost(post) {

        const article = document.createElement("article");
        article.className = "post";

        const mediaURL = escapeHTML(post.media || "");
        const caption = escapeHTML(post.caption || "");
        const location = escapeHTML(post.location || "");
        const hashtags = escapeHTML(post.hashtags || "");

        const mediaHTML = isVideo(post.media || "")
            ? `
                <video
                    class="post-media"
                    src="${mediaURL}"
                    controls
                    playsinline
                    preload="metadata"
                ></video>
            `
            : `
                <img
                    class="post-media"
                    src="${mediaURL}"
                    alt="Postingan Chuk an Chukk"
                    loading="lazy"
                >
            `;

        article.innerHTML = `
            <div class="post-media-container">

                ${mediaHTML}

                <div class="post-actions-side">

                    <button
                        type="button"
                        aria-label="Suka"
                    >
                        ❤️
                    </button>

                    <button
                        type="button"
                        aria-label="Komentar"
                    >
                        💬
                    </button>

                    <button
                        type="button"
                        aria-label="Bagikan"
                    >
                        ↗️
                    </button>

                    <button
                        type="button"
                        aria-label="Simpan"
                    >
                        🔖
                    </button>

                </div>

            </div>

            <div class="post-info">

                <div class="post-user">
                    @chukuser
                </div>

                ${
                    caption
                    ? `<div class="post-caption">${caption}</div>`
                    : ""
                }

                ${
                    location
                    ? `<div class="post-location">📍 ${location}</div>`
                    : ""
                }

                ${
                    hashtags
                    ? `<div class="post-hashtags">${hashtags}</div>`
                    : ""
                }

            </div>
        `;

        return article;
    }

    async function loadPosts() {

        showLoading(true);
        showEmpty(false);

        try {

            if (
                typeof window.chukSupabase === "undefined"
            ) {
                throw new Error(
                    "Supabase Client belum tersedia."
                );
            }

            const {
                data,
                error
            } = await window.chukSupabase
                .from("posts")
                .select("*")
                .eq("privacy", "public")
                .order("created_at", {
                    ascending: false
                });

            if (error) {
                throw error;
            }

            feed
                .querySelectorAll(".post")
                .forEach(post => post.remove());

            if (!data || data.length === 0) {
                showEmpty(true);
                return;
            }

            data.forEach(post => {

                if (!post.media) {
                    return;
                }

                const element =
                    createPost(post);

                feed.appendChild(element);

            });

        } catch (error) {

            console.error(
                "Gagal memuat postingan:",
                error
            );

            feed
                .querySelectorAll(".post")
                .forEach(post => post.remove());

            showEmpty(true);

            if (empty) {
                empty.textContent =
                    "Postingan gagal dimuat.";
            }

        } finally {

            showLoading(false);

        }
    }

    await loadPosts();

});
