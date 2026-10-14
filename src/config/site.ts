export interface Location {
  label: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  addressLines: readonly string[];
  coordinates: { lat: number; lng: number };
  mapsUrl: string;
}

export interface SiteConfig {
  name: string;
  site: string;
  whatsapp: { display: string; e164: string; url: string };
  landline: { display: string; tel: string };
  email: string;
  instagram: { handle: string; url: string };
  openingHours: {
    days: readonly string[];
    opens: string;
    closes: string;
  };
  locations: { store: Location; production: Location };
}

function location(
  fields: Omit<Location, "addressLines">,
): Location {
  return {
    ...fields,
    addressLines: [
      `${fields.street}, ${fields.neighborhood}`,
      `${fields.city} - ${fields.state}, CEP ${fields.postalCode}`,
    ],
  };
}

const whatsappE164 = "5562984420366";
const instagramHandle = "atelier.tecidosoficial";

export const siteConfig: SiteConfig = {
  name: "Atelier Tecidos",
  site: "https://ateliertecidos.com.br",
  whatsapp: {
    display: "(62) 98442-0366",
    e164: whatsappE164,
    url: `https://wa.me/${whatsappE164}`,
  },
  landline: {
    display: "(62) 3294-0595",
    tel: "+556232940595",
  },
  email: "tecidosatelier@gmail.com",
  instagram: {
    handle: instagramHandle,
    url: `https://www.instagram.com/${instagramHandle}/`,
  },
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
  locations: {
    store: location({
      label: "Nossa Loja",
      street: "Av. São Paulo, 298",
      neighborhood: "Setor Campinas",
      city: "Goiânia",
      state: "GO",
      postalCode: "74510-030",
      coordinates: { lat: -16.6707, lng: -49.2909 },
      mapsUrl:
        "https://www.google.com/maps/place/Av.+São+Paulo,+298+-+St.+Campinas/@-16.6708341,-49.2908864,17z/data=!4m7!3m6!1s0x935ef40f1af1d067:0xed6202900c04fe09!4b1!8m2!3d-16.6708341!4d-49.2908864!16s%2Fg%2F11dzsdy4lb?entry=ttu&g_ep=EgoyMDI0MTAyMC4xIKXMDSoASAFQAw%3D%3D",
    }),
    production: location({
      label: "Nossa Produção",
      street: "Rua 11 de Janeiro, Qd 02, Lt 01 e 02",
      neighborhood: "Vila Aurora Oeste",
      city: "Goiânia",
      state: "GO",
      postalCode: "74425-100",
      coordinates: { lat: -16.6797, lng: -49.3068 },
      mapsUrl:
        "https://www.google.com/maps/place/Atelier+Estamparia+Têxtil/@-16.6796345,-49.3069259,20z/data=!4m9!1m2!2m1!1sRua+11+de+Janeiro,+Qd+02,+Lt+01+e+02,+Vila+Aurora+Oeste,+Goiânia+-+GO,+Cep:+74425-100!3m5!1s0x935ef5858515cea9:0x468dcbe16a349116!8m2!3d-16.6797211!4d-49.3068142!16s%2Fg%2F11rsrrq2cc?entry=ttu&g_ep=EgoyMDI0MTAyMC4xIKXMDSoASAFQAw%3D%3D",
    }),
  },
};
