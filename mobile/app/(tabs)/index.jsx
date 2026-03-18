import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuthStore } from "../../store/authStore";
import { Image } from "expo-image";
import { useEffect, useState } from 'react';
import styles from "../../assets/styles/home.styles";
import { API_URL } from '../../constants/api';
import { Ionicons } from "@expo/vector-icons";
import { formatPublishDate } from "../../lib/utils";
import COLORS from '../../constants/colors';
import Loader from '../../components/Loader';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const {token} = useAuthStore();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchDestinations = async (pageNum=1, refresh=false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(`${API_URL}/destinations?page=${pageNum}&limit=2`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch destinations");

      const uniqueDestinations = refresh || pageNum === 1 ? data.destinations : Array.from(new Set([...destinations, ...data.destinations].map((destination) => destination._id))).map((id) => [...destinations, ...data.destinations].find((destination) => destination._id === id));

      setDestinations(uniqueDestinations);

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);

    } catch (error) {
      console.log("Error fetching destinations", error);
    } finally {
      if(refresh) {
        await sleep(800);
        setRefreshing(false);
      }
      else setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchDestinations();
  }, [token]);

  const handleLoadMore = async () => {
    if(hasMore && !loading && !refreshing) {
      await fetchDestinations(page + 1);
    }
  };

  const renderItem = async({item}) => (
    <View style={styles.destinationCard}>
      <View style={styles.destinationHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.destinationImageContainer}>
        <Image source={item.image} style={styles.destinationImage} contentFit="cover" />
      </View>

      <View style={styles.destinationDetails}>
        <Text style={styles.destinationTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
      </View>
 
    </View>
  )

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList 
        data={destinations}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={() => fetchDestinations(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }

        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}

        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Destination254</Text>
            <Text style={styles.headerSubtitle}>Discover and share amazing places 👇</Text>
          </View>
        }

        ListFooterComponent={
          hasMore && destinations.length > 0 ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
          ) : null
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No destinations shared yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share a place you've visited!</Text>
          </View>
        }
      />
    </View>
  )
}