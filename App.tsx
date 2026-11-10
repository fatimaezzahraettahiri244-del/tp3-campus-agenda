import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

const placesRestantes = (e: Evenement): number => Math.max(0, e.capacite - e.inscrits);

const statutEvenement = (e: Evenement): 'Complet' | 'Presque complet' | 'Ouvert' => {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r >= 1 && r <= 3) return 'Presque complet';
  return 'Ouvert';
};

type BadgeProps = { statut: 'Complet' | 'Presque complet' | 'Ouvert' };

function BadgeEtat({ statut }: BadgeProps) {
  let styleBadge = styles.badgeOuvert;
  let styleTexte = styles.texteOuvert;

  if (statut === 'Complet') {
    styleBadge = styles.badgeComplet;
    styleTexte = styles.texteComplet;
  } else if (statut === 'Presque complet') {
    styleBadge = styles.badgePresque;
    styleTexte = styles.textePresque;
  }

  return (
    <View style={[styles.badge, styleBadge]}>
      <Text style={[styles.texteBadge, styleTexte]}>{statut}</Text>
    </View>
  );
}

type StatProps = { label: string; valeur: string | number };

function BlocStatistique({ label, valeur }: StatProps) {
  return (
    <View style={styles.blocStat}>
      <Text style={styles.valeurStat}>{valeur}</Text>
      <Text style={styles.labelStat}>{label}</Text>
    </View>
  );
}

type CarteProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteProps) {
  const rest = placesRestantes(evenement);
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.carte}>
      <View style={styles.enteteCarte}>
        <Text style={styles.titreCarte} numberOfLines={1}>{evenement.titre}</Text>
        <BadgeEtat statut={statut} />
      </View>
      <Text style={styles.categorieCarte}>Catégorie: {evenement.categorie}</Text>
      <Text style={styles.placesCarte}>
        {rest === 0 ? 'Aucune place disponible' : `${rest} place${rest > 1 ? 's' : ''} restante${rest > 1 ? 's' : ''}`}
      </Text>
    </View>
  );
}

export default function App() {
  const mode: 'tous' | 'ateliers' = 'ateliers';

  const totalEvenements = evenements.length;
  const totalComplets = evenements.filter(e => placesRestantes(e) === 0).length;
  const totalAvecPlaces = evenements.filter(e => placesRestantes(e) > 0).length;
  const sommePlacesRestantes = evenements.reduce((acc, e) => acc + placesRestantes(e), 0);

  const listeAffichage = mode === 'tous'
    ? evenements
    : evenements.filter(e => e.categorie === 'Atelier' && placesRestantes(e) > 0);

  return (
    <SafeAreaView style={styles.conteneur}>
      <FlatList
        data={listeAffichage}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.titrePrincipal}>Campus Agenda</Text>
            <Text style={styles.sousTitre}>Événements du campus — IAIL S5</Text>

            {/* Grille de statistiques */}
            <View style={styles.grilleStats}>
              <BlocStatistique label="Total évènements" valeur={totalEvenements} />
              <BlocStatistique label="Places restantes" valeur={sommePlacesRestantes} />
              <BlocStatistique label="Évènements complets" valeur={totalComplets} />
              <BlocStatistique label="Avec places libres" valeur={totalAvecPlaces} />
            </View>

            <Text style={styles.titreSection}>
              {mode === 'tous' ? 'Tous les événements (6)' : 'Ateliers disponibles'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.blocVide}>
            <Text style={styles.texteVide}>Aucun événement ne correspond aux critères.</Text>
          </View>
        }
        contentContainerStyle={styles.listeContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listeContent: {
    padding: 20,
  },
  titrePrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 10,
  },
  sousTitre: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  grilleStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  blocStat: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  valeurStat: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  labelStat: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  titreSection: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
  },
  carte: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  enteteCarte: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titreCarte: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  categorieCarte: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  placesCarte: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  texteBadge: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeComplet: {
    backgroundColor: '#FEE2E2',
  },
  texteComplet: {
    color: '#DC2626',
  },
  badgePresque: {
    backgroundColor: '#FEF3C7',
  },
  textePresque: {
    color: '#D97706',
  },
  badgeOuvert: {
    backgroundColor: '#DCFCE7',
  },
  texteOuvert: {
    color: '#16A34A',
  },
  blocVide: {
    padding: 30,
    alignItems: 'center',
  },
  texteVide: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
});