import React, { useCallback, useState, FormEvent, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from 'react-icons/fi';

import Sidebar from '../components/Sidebar';

import mapIcon from '../utils/mapIcon';
import api from '../services/api';

import '../styles/pages/create-orphanage.css';

const CreateOrphanage: React.FC = () => {
  const history = useHistory();

  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleMapClick = useCallback((evt: LeafletMouseEvent) => {
    const { lat, lng } = evt.latlng;
    setPosition({ latitude: lat, longitude: lng });
  }, []);

  const handleSelectImages = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) return;

    const selectedImages = Array.from(evt.target.files);

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(selectedImage =>
      URL.createObjectURL(selectedImage)
    );

    setPreviewImages(selectedImagesPreview);
  };

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(image => {
      data.append('images', image);
    });

    try {
      await api.post('/orphanages', data);

      alert('Cadastro realizado com sucesso!');
      history.push('/orphanages');
    } catch (err) {
      console.log(err);
      alert('Algo de errado não deu certo!');
    }
  };

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-25.379595, -51.4894753]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position?.latitude && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={evt => setName(evt.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={evt => setAbout(evt.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(previewImage => (
                  <img src={previewImage} alt={name} key={previewImage} />
                ))}

                <label className="new-image" htmlFor="files">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                <input
                  id="files"
                  type="file"
                  multiple
                  onChange={handleSelectImages}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={evt => setInstructions(evt.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={evt => setOpeningHours(evt.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={open_on_weekends ? '' : 'active'}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
};

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;

export default CreateOrphanage;
