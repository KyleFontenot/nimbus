<script lang="ts">
  // import LoadingIcon from "$components/LoadingIcon.svelte";
  let { children }: { children: import('svelte').Snippet } = $props()
</script>

<h1>Photos</h1>
<div class="masonry-grid">
  {children()}
  <!-- <div
    class="masonry-item"
    class:portrait={}
    class:landscape={}
  ></div> -->
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
