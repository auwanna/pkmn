export function AppFooter() {
  return (
    <footer className="flex flex-col items-center justify-center gap-1 border-t px-4 py-4 text-center text-xs md:px-8">
      <p>© {new Date().getFullYear()} PKMN., All rights reserved</p>
      <p>
        This website is not produced, endorsed, supported, or affiliated with
        Nintendo, Game Freak, Wizard's of the Coast, or The Pokémon Company.
      </p>
    </footer>
  );
}
