<script lang="ts">
  // import LoadingIcon from "$components/LoadingIcon.svelte";
  let { path }: { path?: string } = $props()

  // async function grabPhotos() {
  // 	const photos = await fetch(`/photos${path ? `/${path}` : ""}`, {
  // 		method: "PATCH",
  // 	}).then((data) => data.json());
  // 	console.log("grabbedphotos??::", photos);
  // 	// console.log("grabbedphotos??::", `/photos/${photos[0].relative}`);

  // 	return photos;
  // }
</script>

<h1>Photos</h1>
<div class="masonry-grid">
  {#await grabPhotos()}
    <!-- <LoadingIcon /> -->
  {:then filesAndDirs}
    {#if filesAndDirs}
      {#each filesAndDirs as file}
        <div
          class="masonry-item"
          class:portrait={file.dimensions.height > file.dimensions.width}
          class:landscape={file.dimensions.height < file.dimensions.width}
        >
          <a href={`/photos/${file.path}`}>
            <img src={`http://143.197.15.15:5173/photos/${file.file}`} alt={file.name} />
            {file.name}
          </a>
        </div>
      {/each}
    {:else}
      <div>no files found</div>
    {/if}
  {/await}
</div>

<style>
  .masonry-grid {
    --column-width: 250px;
    --gap: 16px;

    columns: var(--column-width);
    column-gap: var(--gap);
    padding: var(--gap);
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }

  .masonry-item {
    break-inside: avoid;
    margin-bottom: var(--gap);
    border-radius: 16px;
    overflow: hidden;
    background: #f0f0f0;
    position: relative;
  }

  /* Base width for all items */
  .masonry-item {
    width: 100%;
    display: inline-block;
  }

  /* Maintain aspect ratios using padding trick */
  .masonry-item::before {
    content: '';
    display: block;
  }

  .masonry-item.square::before {
    padding-bottom: 100%; /* 1:1 */
  }

  .masonry-item.portrait::before {
    padding-bottom: 150%; /* 2:3 */
  }

  .masonry-item.landscape::before {
    padding-bottom: 75%; /* 4:3 */
  }

  .masonry-item img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .masonry-item:hover img {
    transform: scale(1.05);
  }

  /* Responsive adjustments */
  @media (min-width: 768px) {
    .masonry-grid {
      columns: 3;
    }
  }

  @media (min-width: 1024px) {
    .masonry-grid {
      columns: 4;
    }
  }

  @media (min-width: 1400px) {
    .masonry-grid {
      columns: 5;
    }
  }

  @media (max-width: 767px) {
    .masonry-grid {
      columns: 2;
      --column-width: 160px;
      --gap: 12px;
    }
  }

  @media (max-width: 480px) {
    .masonry-grid {
      columns: 1;
      --gap: 8px;
    }
  }
</style>
