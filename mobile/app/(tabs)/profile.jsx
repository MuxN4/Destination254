import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';
import { Ionicons } from '@expo/vector-icons';
import Loader from '../../components/Loader';
import { Image } from 'expo-image';
import COLORS from '../../constants/colors';
import { sleep } from ".";

export default function Profile() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDestinationsId, setDeleteDestinationsId] = useState(null);

  const { token } = useAuthStore();

  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/destinations/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch destinations");

      setDestinations(data);

    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load profile data. Pull down to refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteDestination = async (destinationId) => {
    try {
      setDeleteDestinationsId(destinationId);

      const response = await fetch(`${API_URL}/destinations/${destinationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete destination");

      setDestinations(destinations.filter((destination) => destination._id !== destinationId));
      Alert.alert("Success", "Destination deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete destination");
    } finally {
      setDeleteDestinationsId(null);
    }
  };

  const confirmDelete = (destinationId) => {
    Alert.alert("Delete Destination", "Are you sure you want to delete this destination?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => handleDeleteDestination(destinationId) },
    ]);
  };

  const renderDestinationItem = ({ item }) => (
    <View style={styles.destinationItem}>
      <Image source={item.image} style={styles.destinationImage} />
      <View style={styles.destinationInfo}>
        <Text style={styles.destinationTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.destinationCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.destinationDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        {deleteDestinationsId === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500);
    await fetchData();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      {/* YOUR DESTINATIONS */}
      <View style={styles.destinationsHeader}>
        <Text style={styles.destinationsTitle}>Your Destinations 🗺️</Text>
        <Text style={styles.destinationsCount}>{destinations.length} Destinations</Text>
      </View>

      <FlatList
        data={destinations}
        renderItem={renderDestinationItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.destinationsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No destinations yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Text style={styles.addButtonText}>Add Your First Destination</Text>
            </TouchableOpacity>
          </View>
        }
      />

    </View>
  )
}