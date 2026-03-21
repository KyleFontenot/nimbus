<script lang="ts">
  // --- Base Components ---
  import Alert from '../../../src/components/Alert.svelte'
  import Avatar from '../../../src/components/Avatar.svelte'
  import Badge from '../../../src/components/Badge.svelte'
  import Breadcrumb from '../../../src/components/Breadcrumb.svelte'
  import Button from '../../../src/components/Button.svelte'
  import Card from '../../../src/components/Card.svelte'
  import ClickOutside from '../../../src/components/ClickOutside.svelte'
  import DateInput from '../../../src/components/DateInput.svelte'
  import Details from '../../../src/components/Details.svelte'
  import Dialog from '../../../src/components/Dialog.svelte'
  import Divider from '../../../src/components/Divider.svelte'
  import DropdownMenu from '../../../src/components/DropdownMenu.svelte'
  import Fieldset from '../../../src/components/Fieldset.svelte'
  import Flex from '../../../src/components/Flex.svelte'
  import Form from '../../../src/components/Form.svelte'
  import Grid from '../../../src/components/Grid.svelte'
  import Image from '../../../src/components/Image.svelte'
  import Input from '../../../src/components/Input.svelte'
  import InputStringArray from '../../../src/components/InputStringArray.svelte'
  import Kbd from '../../../src/components/Kbd.svelte'
  import MarkdownEditor from '../../../src/components/MarkdownEditor.svelte'
  import MasonryGrid from '../../../src/components/MasonryGrid.svelte'
  import Pagination from '../../../src/components/Pagination.svelte'
  import Popover from '../../../src/components/Popover.svelte'
  import Progress from '../../../src/components/Progress.svelte'
  import Radio from '../../../src/components/Radio.svelte'
  import Range from '../../../src/components/Range.svelte'
  import Search from '../../../src/components/Search.svelte'
  import Select from '../../../src/components/Select.svelte'
  import Skeleton from '../../../src/components/Skeleton.svelte'
  import Spinner from '../../../src/components/Spinner.svelte'
  import Table from '../../../src/components/Table.svelte'
  import Tabs from '../../../src/components/Tabs.svelte'
  import Tag from '../../../src/components/Tag.svelte'
  import Textarea from '../../../src/components/Textarea.svelte'
  import Toast, { showToast } from '../../../src/components/Toast.svelte'
  import Toggle from '../../../src/components/Toggle.svelte'
  import Tooltip from '../../../src/components/Tooltip.svelte'

  // --- Clumps ---
  import CardMedia from '../../../src/clumps/CardMedia.svelte'
  import ConfirmDialog from '../../../src/clumps/ConfirmDialog.svelte'
  import ContactCard from '../../../src/clumps/ContactCard.svelte'
  import CtaBanner from '../../../src/clumps/CtaBanner.svelte'
  import DataTable from '../../../src/clumps/DataTable.svelte'
  import EmptyState from '../../../src/clumps/EmptyState.svelte'
  import FaqSection from '../../../src/clumps/FaqSection.svelte'
  import FeatureGrid from '../../../src/clumps/FeatureGrid.svelte'
  import FormField from '../../../src/clumps/FormField.svelte'
  import HeroSection from '../../../src/clumps/HeroSection.svelte'
  import LoginForm from '../../../src/clumps/LoginForm.svelte'
  import LogoCloud from '../../../src/clumps/LogoCloud.svelte'
  import MediaObject from '../../../src/clumps/MediaObject.svelte'
  import PageHeader from '../../../src/clumps/PageHeader.svelte'
  import PricingCard from '../../../src/clumps/PricingCard.svelte'
  import SearchField from '../../../src/clumps/SearchField.svelte'
  import StatCard from '../../../src/clumps/StatCard.svelte'
  import StatsRow from '../../../src/clumps/StatsRow.svelte'
  import TestimonialCard from '../../../src/clumps/TestimonialCard.svelte'
  import TestimonialCarousel from '../../../src/clumps/TestimonialCarousel.svelte'
  import TimelineItem from '../../../src/clumps/TimelineItem.svelte'
  import UserBlock from '../../../src/clumps/UserBlock.svelte'

  // --- Layouts ---
  import CenterLayout from '../../../src/layouts/CenterLayout.svelte'
  import DashboardGrid from '../../../src/layouts/DashboardGrid.svelte'
  import PageSection from '../../../src/layouts/PageSection.svelte'
  import SplitView from '../../../src/layouts/SplitView.svelte'

  // --- State ---
  let dialogOpen = $state(false)
  let confirmOpen = $state(false)
  let rangeVal = $state(60)
  let toggleChecked = $state(true)
  let paginationPage = $state(1)
  let tags: string[] = $state(['svelte', 'typescript', 'nimbus'])
  let textareaVal = $state('This textarea auto-resizes as you type.')
  let markdownVal = $state('# Hello\n\nThis is **bold** and _italic_ text.')
  let tocOpen = $state(false)
  let clickOutsideMsg = $state('')

  const tocSections = [
    { id: 'form-inputs', label: 'Form Inputs' },
    { id: 'display', label: 'Display' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'overlays', label: 'Overlays' },
    { id: 'layout-helpers', label: 'Layout Helpers' },
    { id: 'clumps-app', label: 'Clumps (App)' },
    { id: 'clumps-brochure', label: 'Clumps (Brochure)' },
    { id: 'layouts', label: 'Layouts' },
    { id: 'utility', label: 'Utility Components' },
    { id: 'page-level', label: 'Page-Level Components' },
  ]

  const tableData = [
    { id: 1, name: 'Alice Johnson', role: 'Engineer', status: 'Active' },
    { id: 2, name: 'Bob Smith', role: 'Designer', status: 'Away' },
    { id: 3, name: 'Carol White', role: 'PM', status: 'Active' },
    { id: 4, name: 'Dan Lee', role: 'Engineer', status: 'Offline' },
  ]

  const dataTableRows = [
    { name: 'Widget A', category: 'Hardware', price: 29.99, stock: 142 },
    { name: 'Widget B', category: 'Software', price: 9.99, stock: 500 },
    { name: 'Gadget C', category: 'Hardware', price: 49.50, stock: 38 },
    { name: 'Service D', category: 'Service', price: 99.00, stock: 0 },
    { name: 'Tool E', category: 'Software', price: 19.99, stock: 213 },
    { name: 'Part F', category: 'Hardware', price: 5.75, stock: 1040 },
  ]

  const dataTableColumns = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
  ]

  function demoSearchFn(query: string) {
    const items = ['Dashboard', 'Settings', 'Profile', 'Billing', 'Team', 'API Keys', 'Logs']
    return items.filter(i => i.toLowerCase().includes(query.toLowerCase()))
  }

  function simpleParse(md: string): string {
    return `<pre style="white-space:pre-wrap;font-family:inherit;">${md.replace(/</g, '&lt;')}</pre>`
  }
</script>

<div class="demo-layout">
  <!-- Mobile TOC toggle -->
  <button class="toc-toggle" onclick={() => (tocOpen = !tocOpen)}>
    {tocOpen ? 'Close' : 'Menu'} Table of Contents
  </button>

  <!-- Sidebar TOC -->
  <nav class="toc" class:toc-open={tocOpen}>
    <h2 class="toc-title">Nimbus Components</h2>
    <ul class="toc-list">
      {#each tocSections as section}
        <li>
          <a class="toc-link" href="#{section.id}" onclick={() => (tocOpen = false)}>
            {section.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <!-- Main content -->
  <main class="demo-main">
    <header class="demo-header">
      <h1>Nimbus Component Library</h1>
      <p class="demo-subtitle">A comprehensive demonstration of every component, clump, and layout.</p>
    </header>

    <!-- ============================================================ -->
    <!-- FORM INPUTS -->
    <!-- ============================================================ -->
    <section id="form-inputs" class="demo-section">
      <h2 class="section-title">Form Inputs</h2>

      <div class="demo-block">
        <h3>Input</h3>
        <Input label="Full name" placeholder="Jane Doe" />
      </div>

      <div class="demo-block">
        <h3>Input (password)</h3>
        <Input type="password" label="Password" placeholder="Enter password" />
      </div>

      <div class="demo-block">
        <h3>Input (number)</h3>
        <Input type="number" label="Quantity" placeholder="0" />
      </div>

      <div class="demo-block">
        <h3>Input (checkbox)</h3>
        <Input type="checkbox" label="I agree to the terms" />
      </div>

      <div class="demo-block">
        <h3>Textarea</h3>
        <Textarea
          bind:value={textareaVal}
          label="Bio"
          placeholder="Tell us about yourself..."
          autoResize
          showCount
          maxlength={280}
        />
      </div>

      <div class="demo-block">
        <h3>Select</h3>
        <Select
          label="Country"
          blankDefault
          blankLabel="Choose a country"
          options={[
            { value: 'us', text: 'United States' },
            { value: 'uk', text: 'United Kingdom' },
            { value: 'ca', text: 'Canada' },
            { value: 'au', text: 'Australia' },
          ]}
        />
      </div>

      <div class="demo-block">
        <h3>DateInput</h3>
        <DateInput label="Start date" name="start-date" />
      </div>

      <div class="demo-block">
        <h3>Radio</h3>
        <Radio
          name="plan"
          direction="row"
          options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'enterprise', label: 'Enterprise' },
          ]}
        />
      </div>

      <div class="demo-block">
        <h3>Toggle</h3>
        <Toggle bind:checked={toggleChecked} label="Enable notifications" name="notifications" />
      </div>

      <div class="demo-block">
        <h3>Range</h3>
        <Range bind:value={rangeVal} label="Brightness" showValue min={0} max={100} />
      </div>

      <div class="demo-block">
        <h3>InputStringArray</h3>
        <InputStringArray bind:value={tags} label="Tags" name="tags" placeholder="Add a tag..." />
      </div>

      <div class="demo-block">
        <h3>Fieldset</h3>
        <Fieldset legend="Shipping address">
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <Input label="Street" placeholder="123 Main St" />
            <Input label="City" placeholder="Springfield" />
          </div>
        </Fieldset>
      </div>

      <div class="demo-block">
        <h3>Form</h3>
        <Form>
          <FormField label="Email" for="form-email" required helpText="We will never share your email.">
            <Input id="form-email" placeholder="you@example.com" />
          </FormField>
          <FormField label="Message" for="form-msg" error="This field is required.">
            <Textarea id="form-msg" placeholder="Your message" rows={3} />
          </FormField>
          <Button type="submit">Submit</Button>
        </Form>
      </div>

      <div class="demo-block">
        <h3>Search</h3>
        <Search searchFn={demoSearchFn} placeholder="Search pages..." />
      </div>

      <div class="demo-block">
        <h3>MarkdownEditor</h3>
        <MarkdownEditor
          bind:value={markdownVal}
          parse={simpleParse}
          minHeight="10rem"
          maxHeight="20rem"
        />
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- DISPLAY -->
    <!-- ============================================================ -->
    <section id="display" class="demo-section">
      <h2 class="section-title">Display</h2>

      <div class="demo-block">
        <h3>Badge</h3>
        <Flex gap="0.5rem" justify="flex-start">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info" pill>Info Pill</Badge>
        </Flex>
      </div>

      <div class="demo-block">
        <h3>Tag</h3>
        <Flex gap="0.5rem" justify="flex-start">
          <Tag label="Svelte" variant="primary" />
          <Tag label="React" variant="default" />
          <Tag label="Removable" variant="success" removable onremove={() => {}} />
          <Tag label="Link tag" variant="warning" href="#display" />
        </Flex>
      </div>

      <div class="demo-block">
        <h3>Avatar</h3>
        <Flex gap="0.75rem" justify="flex-start" align="center">
          <Avatar initials="KF" size="small" />
          <Avatar initials="NB" size="medium" />
          <Avatar initials="XL" size="large" />
          <Avatar src="https://i.pravatar.cc/96?img=12" alt="User photo" size="large" />
        </Flex>
      </div>

      <div class="demo-block">
        <h3>Kbd</h3>
        <p>Press <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd> to save, or <Kbd>Cmd</Kbd> + <Kbd>K</Kbd> to search.</p>
      </div>

      <div class="demo-block">
        <h3>Card</h3>
        <Card>
          {#snippet header()}
            Card Header
          {/snippet}
          This is the card body content. Cards can hold any kind of content.
          {#snippet footer()}
            <Flex gap="0.5rem" justify="flex-end">
              <Button minimal>Cancel</Button>
              <Button>Save</Button>
            </Flex>
          {/snippet}
        </Card>
      </div>

      <div class="demo-block">
        <h3>Card (status)</h3>
        <Flex gap="1rem" direction="column">
          <Card status="success">Operation completed successfully.</Card>
          <Card status="failure">An error occurred during processing.</Card>
        </Flex>
      </div>

      <div class="demo-block">
        <h3>Details (Accordion)</h3>
        <Flex direction="column" gap="0.5rem">
          <Details summary="What is Nimbus?">
            <p>Nimbus is a Svelte 5 component library focused on clean, accessible, and composable UI primitives.</p>
          </Details>
          <Details summary="How do I install it?">
            <p>Import components directly from the source files or install the package from npm.</p>
          </Details>
        </Flex>
      </div>

      <div class="demo-block">
        <h3>Tabs</h3>
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'features', label: 'Features' },
            { id: 'pricing', label: 'Pricing', disabled: true },
          ]}
        >
          {#snippet children(activeId)}
            {#if activeId === 'overview'}
              <p>Nimbus provides 45+ base components and 23 pre-built clumps for rapid UI development.</p>
            {:else if activeId === 'features'}
              <p>Svelte 5 runes, accessible by default, fully typed, zero external dependencies.</p>
            {:else}
              <p>Pricing details coming soon.</p>
            {/if}
          {/snippet}
        </Tabs>
      </div>

      <div class="demo-block">
        <h3>Table</h3>
        <Table striped hoverable>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {#each tableData as row}
              <tr>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.role}</td>
                <td><Badge variant={row.status === 'Active' ? 'success' : row.status === 'Away' ? 'warning' : 'default'} size="small">{row.status}</Badge></td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </div>

      <div class="demo-block">
        <h3>Image</h3>
        <Image
          src="https://picsum.photos/600/300"
          alt="Random landscape"
          aspectRatio="2/1"
          rounded
          style="max-width:100%;"
        />
      </div>

      <div class="demo-block">
        <h3>Divider</h3>
        <p>Content above</p>
        <Divider />
        <p>Content below</p>
        <Divider label="OR" />
        <p>Content after labeled divider</p>
      </div>

      <div class="demo-block">
        <h3>MasonryGrid</h3>
        <MasonryGrid columns="180px" gap="12px" maxWidth="100%">
          {#each [120, 180, 100, 200, 140, 160] as height, i}
            <div style="background:var(--blue-1,#e3f2fd);border-radius:8px;height:{height}px;display:flex;align-items:center;justify-content:center;break-inside:avoid;margin-bottom:12px;">
              Item {i + 1}
            </div>
          {/each}
        </MasonryGrid>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- FEEDBACK -->
    <!-- ============================================================ -->
    <section id="feedback" class="demo-section">
      <h2 class="section-title">Feedback</h2>

      <div class="demo-block">
        <h3>Alert</h3>
        <Flex direction="column" gap="0.5rem">
          <Alert variant="info">Informational message for the user.</Alert>
          <Alert variant="success" dismissible>Success! This alert can be dismissed.</Alert>
          <Alert variant="warning">Warning: please review before continuing.</Alert>
          <Alert variant="error">Error: unable to process your request.</Alert>
        </Flex>
      </div>

      <div class="demo-block">
        <h3>Toast</h3>
        <Flex gap="0.5rem" justify="flex-start">
          <Button onclick={() => showToast('File saved!', { type: 'success' })}>
            Success Toast
          </Button>
          <Button onclick={() => showToast('Something went wrong.', { type: 'error', duration: 5000 })}>
            Error Toast
          </Button>
          <Button onclick={() => showToast('New update available.', { type: 'info', links: [{ href: '#', text: 'View' }] })}>
            Toast with Link
          </Button>
        </Flex>
        <Toast />
      </div>

      <div class="demo-block">
        <h3>Progress</h3>
        <Flex direction="column" gap="1rem">
          <Progress value={75} max={100} label="Upload progress" size="large" />
          <Progress value={30} max={100} label="Processing" size="medium" />
          <Progress label="Loading..." size="small" />
        </Flex>
      </div>

      <div class="demo-block">
        <h3>Spinner</h3>
        <Flex gap="1rem" justify="flex-start" align="center">
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large" />
        </Flex>
      </div>

      <div class="demo-block">
        <h3>Skeleton</h3>
        <Skeleton lines={3} />
        <div style="display:flex;gap:0.75rem;margin-top:1rem;">
          <Skeleton circle height="3rem" />
          <div style="flex:1;">
            <Skeleton lines={2} />
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- NAVIGATION -->
    <!-- ============================================================ -->
    <section id="navigation" class="demo-section">
      <h2 class="section-title">Navigation</h2>

      <div class="demo-block">
        <h3>Breadcrumb</h3>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Widget A' },
          ]}
        />
      </div>

      <div class="demo-block">
        <h3>Pagination</h3>
        <Pagination bind:page={paginationPage} total={150} perPage={10} siblings={2} />
        <p style="margin-top:0.5rem;color:#888;font-size:0.85rem;">Current page: {paginationPage}</p>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- OVERLAYS -->
    <!-- ============================================================ -->
    <section id="overlays" class="demo-section">
      <h2 class="section-title">Overlays</h2>

      <div class="demo-block">
        <h3>Dialog</h3>
        <Button onclick={() => (dialogOpen = true)}>Open Dialog</Button>
        <Dialog bind:open={dialogOpen} label="Example dialog">
          <h3 style="margin:0 0 0.5rem;">Dialog Title</h3>
          <p>This is a modal dialog. Click the X or the backdrop to close it.</p>
        </Dialog>
      </div>

      <div class="demo-block">
        <h3>DropdownMenu</h3>
        <DropdownMenu
          items={[
            { label: 'Edit', onclick: () => {} },
            { label: 'Duplicate', onclick: () => {} },
            { separator: true, label: '' },
            { label: 'Archive', onclick: () => {} },
            { label: 'Delete', onclick: () => {}, disabled: true },
          ]}
        >
          {#snippet trigger()}
            <Button>Actions</Button>
          {/snippet}
        </DropdownMenu>
      </div>

      <div class="demo-block">
        <h3>Popover</h3>
        <Popover position="bottom">
          {#snippet trigger()}
            <Button>Show Popover</Button>
          {/snippet}
          <div style="padding:0.5rem;">
            <p style="margin:0 0 0.5rem;font-weight:600;">Popover Content</p>
            <p style="margin:0;font-size:0.9rem;color:#666;">This popover can contain any content including forms, buttons, or rich text.</p>
          </div>
        </Popover>
      </div>

      <div class="demo-block">
        <h3>Tooltip</h3>
        <Flex gap="1rem" justify="flex-start">
          <Tooltip text="Top tooltip" position="top"><Button>Top</Button></Tooltip>
          <Tooltip text="Right tooltip" position="right"><Button>Right</Button></Tooltip>
          <Tooltip text="Bottom tooltip" position="bottom"><Button>Bottom</Button></Tooltip>
          <Tooltip text="Left tooltip" position="left"><Button>Left</Button></Tooltip>
        </Flex>
      </div>

      <div class="demo-block">
        <h3>ClickOutside</h3>
        <ClickOutside onclickoutside={() => (clickOutsideMsg = 'Clicked outside!')}>
          <div style="padding:1rem;border:2px dashed #ccc;border-radius:8px;text-align:center;">
            <p style="margin:0;">Click outside this box to trigger the event.</p>
            {#if clickOutsideMsg}
              <p style="margin:0.5rem 0 0;color:var(--green-9,#2e7d32);font-weight:600;">{clickOutsideMsg}</p>
            {/if}
          </div>
        </ClickOutside>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- LAYOUT HELPERS -->
    <!-- ============================================================ -->
    <section id="layout-helpers" class="demo-section">
      <h2 class="section-title">Layout Helpers</h2>

      <div class="demo-block">
        <h3>Flex</h3>
        <Flex gap="0.5rem" justify="flex-start" align="center">
          <div class="layout-box">1</div>
          <div class="layout-box">2</div>
          <div class="layout-box">3</div>
          <div class="layout-box">4</div>
        </Flex>
      </div>

      <div class="demo-block">
        <h3>Grid</h3>
        <Grid columns="repeat(3, 1fr)" gap="0.5rem">
          <div class="layout-box">A</div>
          <div class="layout-box">B</div>
          <div class="layout-box">C</div>
          <div class="layout-box">D</div>
          <div class="layout-box">E</div>
          <div class="layout-box">F</div>
        </Grid>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- CLUMPS (APP) -->
    <!-- ============================================================ -->
    <section id="clumps-app" class="demo-section">
      <h2 class="section-title">Clumps (App)</h2>

      <div class="demo-block">
        <h3>PageHeader</h3>
        <PageHeader
          title="Team Members"
          subtitle="Manage your organization's team members and their permissions."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Settings', href: '/settings' },
            { label: 'Team' },
          ]}
        >
          {#snippet actions()}
            <Button>Invite Member</Button>
          {/snippet}
        </PageHeader>
      </div>

      <div class="demo-block">
        <h3>FormField</h3>
        <FormField label="Username" for="ff-user" required helpText="Choose a unique username.">
          <Input id="ff-user" placeholder="johndoe" />
        </FormField>
        <FormField label="Bio" for="ff-bio" error="Bio must be at least 10 characters.">
          <Textarea id="ff-bio" placeholder="Write a short bio..." rows={2} />
        </FormField>
      </div>

      <div class="demo-block">
        <h3>UserBlock</h3>
        <Flex direction="column" gap="1rem">
          <UserBlock name="Kyle Fontenot" subtitle="Lead Developer" initials="KF" size="large" />
          <UserBlock name="Jane Smith" subtitle="Designer" initials="JS" size="medium" />
          <UserBlock name="Alex Kim" subtitle="Intern" initials="AK" size="small" />
        </Flex>
      </div>

      <div class="demo-block">
        <h3>StatCard</h3>
        <DashboardGrid minItemWidth="14rem">
          <StatCard label="Revenue" value="$48,200" trend="up" trendValue="+12.5%" />
          <StatCard label="Active Users" value="2,847" trend="up" trendValue="+8%" />
          <StatCard label="Churn Rate" value="3.2%" trend="down" trendValue="+0.4%" />
        </DashboardGrid>
      </div>

      <div class="demo-block">
        <h3>DataTable</h3>
        <DataTable
          data={dataTableRows}
          columns={dataTableColumns}
          searchable
          searchKeys={['name', 'category']}
          pageSize={4}
        />
      </div>

      <div class="demo-block">
        <h3>EmptyState</h3>
        <EmptyState
          title="No projects yet"
          description="Create your first project to get started with Nimbus."
        >
          <Button>Create Project</Button>
        </EmptyState>
      </div>

      <div class="demo-block">
        <h3>ConfirmDialog</h3>
        <Button onclick={() => (confirmOpen = true)} color="secondary">Delete Item</Button>
        <ConfirmDialog
          bind:open={confirmOpen}
          title="Delete this item?"
          description="This action cannot be undone. The item and all associated data will be permanently removed."
          confirmLabel="Delete"
          cancelLabel="Keep it"
          variant="danger"
          onconfirm={() => { confirmOpen = false; showToast('Item deleted.', { type: 'error' }) }}
        />
      </div>

      <div class="demo-block">
        <h3>SearchField</h3>
        <SearchField placeholder="Search products..." shortcutHint="/" />
      </div>

      <div class="demo-block">
        <h3>MediaObject</h3>
        <MediaObject align="center">
          {#snippet media()}
            <Avatar initials="MO" size="large" />
          {/snippet}
          <div>
            <p style="margin:0;font-weight:600;">Media Object</p>
            <p style="margin:0.25rem 0 0;color:#666;font-size:0.9rem;">A classic layout pattern with a media element alongside text content. Useful for comments, notifications, and list items.</p>
          </div>
        </MediaObject>
      </div>

      <div class="demo-block">
        <h3>LoginForm</h3>
        <div style="max-width:24rem;">
          <LoginForm
            title="Welcome back"
            subtitle="Sign in to your account"
            showRememberMe
            showForgotPassword
            registerHref="/register"
          />
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- CLUMPS (BROCHURE) -->
    <!-- ============================================================ -->
    <section id="clumps-brochure" class="demo-section">
      <h2 class="section-title">Clumps (Brochure)</h2>

      <div class="demo-block">
        <h3>HeroSection</h3>
        <HeroSection
          title="Build beautiful UIs with Nimbus"
          subtitle="A comprehensive Svelte 5 component library with 45+ components, ready-to-use clumps, and flexible layouts."
          ctaLabel="Get Started"
          ctaHref="#"
          secondaryLabel="View Docs"
          secondaryHref="#"
          centered
        />
      </div>

      <div class="demo-block">
        <h3>CardMedia</h3>
        <div style="max-width:22rem;">
          <CardMedia
            src="https://picsum.photos/seed/nimbus/400/225"
            alt="Project thumbnail"
            title="Project Alpha"
            description="A cutting-edge application built with Svelte 5 and Nimbus components."
          />
        </div>
      </div>

      <div class="demo-block">
        <h3>FeatureGrid</h3>
        <FeatureGrid
          columns={3}
          features={[
            { title: 'Accessible', description: 'Built with ARIA attributes and keyboard navigation out of the box.' },
            { title: 'Typed', description: 'Full TypeScript support with strict prop interfaces for every component.' },
            { title: 'Composable', description: 'Mix and match components and snippets to build complex UIs.' },
          ]}
        />
      </div>

      <div class="demo-block">
        <h3>StatsRow</h3>
        <StatsRow
          stats={[
            { value: '45+', label: 'Components' },
            { value: '23', label: 'Clumps' },
            { value: '7', label: 'Layouts' },
            { value: '0', label: 'Dependencies' },
          ]}
        />
      </div>

      <div class="demo-block">
        <h3>TestimonialCard</h3>
        <div style="max-width:28rem;">
          <TestimonialCard
            quote="Nimbus has completely transformed how we build UIs. The components are clean, well-documented, and incredibly easy to customize."
            author="Sarah Chen"
            role="CTO"
            company="TechCorp"
            rating={5}
          />
        </div>
      </div>

      <div class="demo-block">
        <h3>TestimonialCarousel</h3>
        <TestimonialCarousel
          testimonials={[
            { quote: 'The best component library for Svelte 5.', author: 'Mike R.', role: 'Developer', rating: 5 },
            { quote: 'Clean, accessible, and easy to integrate.', author: 'Lisa T.', role: 'Designer', company: 'DesignCo', rating: 4 },
            { quote: 'Saved us weeks of development time.', author: 'David K.', role: 'PM', company: 'StartupXYZ', rating: 5 },
          ]}
          autoPlay
          interval={4000}
        />
      </div>

      <div class="demo-block">
        <h3>PricingCard</h3>
        <Flex gap="1rem" justify="center" wrap>
          <div style="flex:1;min-width:200px;max-width:280px;">
            <PricingCard
              name="Starter"
              price="$0"
              description="For personal projects"
              features={['5 projects', 'Basic support', 'Community access']}
            />
          </div>
          <div style="flex:1;min-width:200px;max-width:280px;">
            <PricingCard
              name="Pro"
              price="$29"
              description="For growing teams"
              features={['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom themes']}
              highlighted
              badge="Popular"
            />
          </div>
          <div style="flex:1;min-width:200px;max-width:280px;">
            <PricingCard
              name="Enterprise"
              price="$99"
              description="For large organizations"
              features={['Everything in Pro', 'SSO & SAML', 'Dedicated account manager', 'SLA guarantee']}
            />
          </div>
        </Flex>
      </div>

      <div class="demo-block">
        <h3>CtaBanner</h3>
        <CtaBanner
          title="Ready to get started?"
          description="Join thousands of developers building with Nimbus today."
          buttonLabel="Start Building"
          buttonHref="#"
          variant="accent"
        />
      </div>

      <div class="demo-block">
        <h3>FaqSection</h3>
        <FaqSection
          title="Frequently Asked Questions"
          items={[
            { question: 'Is Nimbus free to use?', answer: 'Yes, Nimbus is open source and free for both personal and commercial projects.' },
            { question: 'Does it support Svelte 4?', answer: 'Nimbus is built for Svelte 5 with runes and snippets. Svelte 4 is not supported.' },
            { question: 'Can I customize the theme?', answer: 'Absolutely. All components use CSS custom properties for easy theming.' },
          ]}
        />
      </div>

      <div class="demo-block">
        <h3>TimelineItem</h3>
        <div>
          <TimelineItem date="March 2026" title="v1.0 Release" description="Initial public release with 45 base components." active />
          <TimelineItem date="February 2026" title="Beta Launch" description="Open beta with community feedback." />
          <TimelineItem date="January 2026" title="Alpha" description="Internal testing and API finalization." />
        </div>
      </div>

      <div class="demo-block">
        <h3>ContactCard</h3>
        <div style="max-width:22rem;">
          <ContactCard
            name="Nimbus HQ"
            email="hello@nimbus.dev"
            phone="+1 (555) 123-4567"
            address="123 Component Lane, UI City, CA 90210"
            hours="Mon-Fri 9am-5pm PST"
          />
        </div>
      </div>

      <div class="demo-block">
        <h3>LogoCloud</h3>
        <LogoCloud
          title="Trusted by industry leaders"
          logos={[
            { src: 'https://picsum.photos/seed/logo1/120/40', alt: 'Company A' },
            { src: 'https://picsum.photos/seed/logo2/120/40', alt: 'Company B' },
            { src: 'https://picsum.photos/seed/logo3/120/40', alt: 'Company C' },
            { src: 'https://picsum.photos/seed/logo4/120/40', alt: 'Company D' },
          ]}
        />
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- LAYOUTS -->
    <!-- ============================================================ -->
    <section id="layouts" class="demo-section">
      <h2 class="section-title">Layouts</h2>

      <div class="demo-block">
        <h3>PageSection</h3>
        <PageSection maxWidth="100%" background="var(--blue-1, #e3f2fd)" padding="2rem 1rem">
          <p style="margin:0;text-align:center;">This content is inside a <code>PageSection</code> with a custom background and padding.</p>
        </PageSection>
      </div>

      <div class="demo-block">
        <h3>DashboardGrid</h3>
        <DashboardGrid minItemWidth="10rem" gap="0.75rem">
          {#each ['Metric A', 'Metric B', 'Metric C', 'Metric D'] as label}
            <div class="layout-box" style="padding:1rem;text-align:center;">{label}</div>
          {/each}
        </DashboardGrid>
      </div>

      <div class="demo-block">
        <h3>SplitView</h3>
        <SplitView ratio="2:1" gap="1rem" stackBelow="480px">
          {#snippet primary()}
            <div class="layout-box" style="padding:2rem;text-align:center;">Primary (2fr)</div>
          {/snippet}
          {#snippet secondary()}
            <div class="layout-box" style="padding:2rem;text-align:center;">Secondary (1fr)</div>
          {/snippet}
        </SplitView>
      </div>

      <div class="demo-block">
        <h3>CenterLayout</h3>
        <div style="border:1px dashed #ccc;border-radius:8px;overflow:hidden;">
          <CenterLayout maxWidth="20rem" fullHeight={false}>
            <Card>
              <p style="text-align:center;margin:0;">Centered content inside a <code>CenterLayout</code>.</p>
            </Card>
          </CenterLayout>
        </div>
      </div>

      <div class="demo-block">
        <h3>AuthLayout</h3>
        <p style="color:#666;font-size:0.9rem;">
          <code>AuthLayout</code> provides a full-page centered layout with branding, suitable for login/register pages. Best viewed as a standalone page.
        </p>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- UTILITY -->
    <!-- ============================================================ -->
    <section id="utility" class="demo-section">
      <h2 class="section-title">Utility Components</h2>
      <div class="demo-block">
        <p>These components are functional utilities rather than visual elements:</p>
        <ul class="utility-list">
          <li><code>MetaTags</code> -- Sets page meta tags (title, description, Open Graph, Twitter cards, JSON-LD). Use in your layout or page head.</li>
          <li><code>MarkdownViewer</code> -- Renders parsed markdown HTML. Requires a <code>parse</code> function (e.g., marked, markdown-it).</li>
          <li><code>ConditionalWrapper</code> -- Wraps children in an element only when <code>wrap</code> is true. Useful for conditional links or containers.</li>
          <li><code>Render</code> -- Accepts either a Svelte Snippet or Component via the <code>of</code> prop and renders it. Useful for dynamic content.</li>
          <li><code>ClickOutside</code> -- Fires a callback when the user clicks outside the wrapped element. Demonstrated above in Overlays.</li>
        </ul>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- PAGE-LEVEL -->
    <!-- ============================================================ -->
    <section id="page-level" class="demo-section">
      <h2 class="section-title">Page-Level Components</h2>
      <div class="demo-block">
        <p>These components are designed to be used at the page/layout level and are not suitable for inline demos:</p>
        <ul class="utility-list">
          <li><code>Navbar</code> -- Top navigation bar with logo, links, and optional actions. Use in your root layout.</li>
          <li><code>Sidebar</code> -- Vertical navigation sidebar with collapsible sections. Typically used in dashboard layouts.</li>
          <li><code>BottomNav</code> -- Mobile-style bottom navigation bar with icon + label items.</li>
          <li><code>AppShell</code> -- Full-page layout shell that combines Navbar, Sidebar, and content area into a cohesive dashboard structure.</li>
        </ul>
      </div>
    </section>

    <footer class="demo-footer">
      <Divider />
      <p>Nimbus Component Library -- Built with Svelte 5</p>
    </footer>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: var(--font-sans, var(--font2, system-ui, -apple-system, sans-serif));
    color: var(--text-1, var(--fore, #222));
    background: var(--surface-1, #fff);
  }

  .demo-layout {
    display: flex;
    min-height: 100vh;
  }

  /* --- TOC Sidebar --- */
  .toc {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 220px;
    flex-shrink: 0;
    overflow-y: auto;
    padding: 1.5rem 1rem;
    border-right: 1px solid var(--gray-200, #e0e0e0);
    background: var(--surface-2, #f9f9f9);
  }

  .toc-title {
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0 0 1rem;
    letter-spacing: 0.02em;
  }

  .toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .toc-link {
    display: block;
    padding: 0.35rem 0.5rem;
    font-size: 0.82rem;
    color: var(--gray-600, #555);
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.15s, color 0.15s;
  }

  .toc-link:hover {
    background: var(--gray-100, #f0f0f0);
    color: var(--text-1, #222);
  }

  .toc-toggle {
    display: none;
  }

  /* --- Main Content --- */
  .demo-main {
    flex: 1;
    min-width: 0;
    max-width: 56rem;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .demo-header {
    margin-bottom: 2.5rem;
  }

  .demo-header h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .demo-subtitle {
    margin: 0.5rem 0 0;
    color: var(--gray-500, #888);
    font-size: 1rem;
  }

  .demo-section {
    margin-bottom: 3rem;
    scroll-margin-top: 1rem;
  }

  .section-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 1.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--gray-200, #e0e0e0);
  }

  .demo-block {
    margin-bottom: 2rem;
  }

  .demo-block h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
    color: var(--gray-700, #444);
  }

  .layout-box {
    background: var(--blue-1, #e3f2fd);
    border: 1px solid var(--blue-3, #90caf9);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--blue-9, #1565c0);
  }

  .utility-list {
    margin: 0;
    padding: 0 0 0 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--gray-600, #555);
    line-height: 1.5;
  }

  .utility-list code {
    font-weight: 600;
    background: var(--gray-100, #f0f0f0);
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-size: 0.85em;
  }

  .demo-footer {
    padding: 2rem 0 1rem;
    text-align: center;
    font-size: 0.85rem;
    color: var(--gray-400, #aaa);
  }

  /* --- Mobile: Collapsible TOC --- */
  @media (max-width: 767px) {
    .demo-layout {
      flex-direction: column;
    }

    .toc {
      position: static;
      height: auto;
      width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--gray-200, #e0e0e0);
      display: none;
      padding: 1rem;
    }

    .toc-open {
      display: block;
    }

    .toc-toggle {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--surface-2, #f9f9f9);
      border: none;
      border-bottom: 1px solid var(--gray-200, #e0e0e0);
      cursor: pointer;
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-1, #222);
      text-align: left;
    }

    .demo-main {
      padding: 1.5rem 1rem;
    }

    .demo-header h1 {
      font-size: 1.5rem;
    }
  }
</style>
