<script lang="ts">
  import Input from './Input.svelte'
  import { writable, type Writable } from 'svelte/store'
  // import {allEmployees, fullName} from "./+page.svelte"

  interface Props {
    style?: string | null
    searchFn: ((any: InputEvent) => unknown) | ((any: InputEvent) => Promise<unknown>)
    onResultClick?: (() => void) | undefined
    onEmptyValue?: (() => void) | undefined
    resultsStore?: Writable<unknown[]>
    show?: Writable<boolean>
    delay?: number
    [key: string]: unknown
  }

  let {
    style = null,
    searchFn,
    onResultClick = undefined,
    onEmptyValue = undefined,
    resultsStore = writable([]),
    show = writable(false),
    delay = 600,
    ...rest
  }: Props = $props()
  // use the resultStore prop for keeping the result store external for controlling how the results are displayed from the parent

  // const internalresults = $state([]);
  // const [internalresults, irstore] = fivestore([]);

  // let results : Writable<unknown> = resultsStore ?? irstore;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined = $state(undefined)
</script>

<!-- <ClickOutside
	on:clickoutside={() => {
		show.set(false);
		// show = false;
	}}
	style="display: flex;justify-content:center;text-align: center;"
> -->
<div class="wrapper">
  <div class="searchbar hideonprint {rest.class || ''}" style:style>
    <Input
      type="text"
      placeholder="Search..."
      style="width: 100%;max-width:25rem;box-shadow: 0 3px 12px -6px #888;"
      onfocus={() => {
        show.set(true)
        // show = true;
      }}
      oninput={async (e: InputEvent) => {
        clearTimeout(debounceTimer)
        if (e.target.value === '') {
          if (!resultsStore) {
            show.set(false)
            // show = false;
          }
          onEmptyValue && onEmptyValue()
          resultsStore.set([])
        } else {
          debounceTimer = setTimeout(async () => {
            const searchquery = await searchFn(e)
            if (Array.isArray(searchquery)) {
              resultsStore.set(searchquery)
            }
            // results = searchquery;
          }, delay)
        }
      }}
    />
    {#if !resultsStore && show}
      <div class="results">
        {#each $resultsStore as result}
          <div
            class="result"
            role="button"
            tabindex="0"
            onclick={() => {}}
            onkeypress={() => {}}
          ></div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- </ClickOutside> -->

<style lang="scss">
  .searchbar {
    z-index: 200;
    position: relative;
    display: block;
    margin-inline: auto;
    text-align: center;
    margin-bottom: 1rem;
  }
  .results {
    z-index: 201;
    position: relative;
    top: 2.8rem;
    position: absolute;
    box-shadow: 0 6px 15px -3px #00000099;
    border-radius: 8px;
  }
  .result {
    display: flex;
    flex-flow: row nowrap;
    display: grid;
    grid-template-columns: 1fr 4.5rem;
    grid-template-rows: 1fr;
    background-color: white;
    gap: 1rem;
    border-bottom: 1px solid #bbb;
    padding: 0.6rem 0.8rem;
    color: #444;
    // border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.15s;
    &:last-of-type {
      border-bottom: 0px solid transparent;
    }
    &:hover {
      background-color: var(--white-2);
      background-color: #f1f3fd;
    }
  }
  .extension {
    justify-content: center;
    background-color: var(--primary-4);
    padding: 0.2rem 0.4rem;
    border-radius: 5px;
    text-align: center;
    letter-spacing: 0.2px;
    font-size: 115%;
    font-weight: 500;
    color: #444;
  }
  .wrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }
</style>
