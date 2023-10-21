export default function login() {
  return (
    <div>
      <h1 className="text-center text-3xl ">S'inscrire</h1>
      <form
        className="md:grid md:grid-cols-2 gap-4 justify-between h-[73vh] m-5 p-5 bg-slate-50"
        action=""
        method=""
      >
        <div className="mb-4">
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-gray-700"
          >
            Nom :
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email :
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="motDePasse"
            className="block text-sm font-medium text-gray-700"
          >
            Mot de passe :
          </label>
          <input
            type="password"
            id="motDePasse"
            name="motDePasse"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="genre"
            className="block text-sm font-medium text-gray-700"
          >
            Genre :
          </label>
          <select
            id="genre"
            name="genre"
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="accepter" className="flex items-center">
            <input
              type="checkbox"
              id="accepter"
              name="accepter"
              required
              className="mr-2"
            />
            J'accepte les conditions d'utilisation
          </label>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-2"
          >
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
}
