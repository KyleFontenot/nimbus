// Barrel re-exports
export * from './components';
export * from './layouts';
export * from './clumps';
export * from './utils';

// Named default export for convenience: import Nimbus from 'nimbus'
import Alert from "./components/Alert.svelte";
import Avatar from "./components/Avatar.svelte";
import Badge from "./components/Badge.svelte";
import BottomNav from "./components/BottomNav.svelte";
import Breadcrumb from "./components/Breadcrumb.svelte";
import Button from "./components/Button.svelte";
import Card from "./components/Card.svelte";
import ClickOutside from "./components/ClickOutside.svelte";
import ConditionalWrapper from "./components/ConditionalWrapper.svelte";
import DateInput from "./components/DateInput.svelte";
import Details from "./components/Details.svelte";
import Dialog from "./components/Dialog.svelte";
import Divider from "./components/Divider.svelte";
import DropdownMenu from "./components/DropdownMenu.svelte";
import Flex from "./components/Flex.svelte";
import Form from "./components/Form.svelte";
import Grid from "./components/Grid.svelte";
import Image from "./components/Image.svelte";
import Input from "./components/Input.svelte";
import InputStringArray from "./components/InputStringArray.svelte";
import MarkdownEditor from "./components/MarkdownEditor.svelte";
import MarkdownViewer from "./components/MarkdownViewer.svelte";
import MasonryGrid from "./components/MasonryGrid.svelte";
import MetaTags from "./components/MetaTags.svelte";
import Navbar from "./components/Navbar.svelte";
import Pagination from "./components/Pagination.svelte";
import Popover from "./components/Popover.svelte";
import Progress from "./components/Progress.svelte";
import Radio from "./components/Radio.svelte";
import Range from "./components/Range.svelte";
import Search from "./components/Search.svelte";
import Select from "./components/Select.svelte";
import Sidebar from "./components/Sidebar.svelte";
import Skeleton from "./components/Skeleton.svelte";
import Spinner from "./components/Spinner.svelte";
import Table from "./components/Table.svelte";
import Tabs from "./components/Tabs.svelte";
import Tag from "./components/Tag.svelte";
import Toast from "./components/Toast.svelte";
import Toggle from "./components/Toggle.svelte";
import Tooltip from "./components/Tooltip.svelte";

const Nimbus = {
  Alert,
  Avatar,
  Badge,
  BottomNav,
  Breadcrumb,
  Button,
  Card,
  ClickOutside,
  ConditionalWrapper,
  DateInput,
  Details,
  Dialog,
  Divider,
  DropdownMenu,
  Flex,
  Form,
  Grid,
  Image,
  Input,
  InputStringArray,
  MarkdownEditor,
  MarkdownViewer,
  MasonryGrid,
  MetaTags,
  Navbar,
  Pagination,
  Popover,
  Progress,
  Radio,
  Range,
  Search,
  Select,
  Sidebar,
  Skeleton,
  Spinner,
  Table,
  Tabs,
  Tag,
  Toast,
  Toggle,
  Tooltip,
};

export default Nimbus;
