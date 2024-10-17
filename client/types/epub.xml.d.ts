interface OPFManifestItem {
  $: {
    id: string;
    href: string;
    'media-type': string;
  };
}

interface ParsedItem {
  id: string;
  href: string;
  mediaType: string;
}

interface OPFParsedData {
  package: {
    manifest: [
      {
        item: OPFManifestItem[];
      },
    ];
    spine: [
      {
        itemref: ItemRef[];
      },
    ];
  };
}

interface ItemRef {
  $: {
    idref: string;
    linear: string;
  };
}

interface Rootfile {
  $: {
    'full-path': string;
    'media-type': string;
  };
}

// Define the structure for the entire parsed container.xml
interface ContainerParsedData {
  container: {
    rootfiles: [
      {
        rootfile: Rootfile[];
      },
    ];
  };
}
