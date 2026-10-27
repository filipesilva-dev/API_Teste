import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Tipo que representa um post da API
type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // ========== GET ==========
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}?_limit=5`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (error) {
      Alert.alert('Erro no GET', String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ========== POST ==========
  const createPost = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Atenção', 'Preencha título e corpo antes de criar.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          title,
          body,
          userId: 1,
        }),
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const newPost: Post = await response.json();
      // A API fake retorna id 101; adicionamos no topo da lista local
      setPosts((prev) => [{ ...newPost, id: Date.now() }, ...prev]);
      setTitle('');
      setBody('');
      Alert.alert('POST', 'Post criado com sucesso (simulado).');
    } catch (error) {
      Alert.alert('Erro no POST', String(error));
    } finally {
      setLoading(false);
    }
  };

  // ========== PUT ==========
  const updatePostPut = async (post: Post) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          id: post.id,
          userId: post.userId,
          title: post.title + ' [PUT]',
          body: post.body + ' (atualizado via PUT)',
        }),
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const updated: Post = await response.json();
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, ...updated } : p))
      );
      Alert.alert('PUT', 'Post atualizado completamente (simulado).');
    } catch (error) {
      Alert.alert('Erro no PUT', String(error));
    } finally {
      setLoading(false);
    }
  };

  // ========== PATCH ==========
  const updatePostPatch = async (post: Post) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          title: post.title + ' [PATCH]',
        }),
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const updated: Post = await response.json();
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, ...updated } : p))
      );
      Alert.alert('PATCH', 'Título atualizado parcialmente (simulado).');
    } catch (error) {
      Alert.alert('Erro no PATCH', String(error));
    } finally {
      setLoading(false);
    }
  };

  // ========== DELETE ==========
  const deletePost = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      setPosts((prev) => prev.filter((p) => p.id !== id));
      Alert.alert('DELETE', 'Post removido (simulado).');
    } catch (error) {
      Alert.alert('Erro no DELETE', String(error));
    } finally {
      setLoading(false);
    }
  };

  // ========== Render ==========
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>JSONPlaceholder + Fetch</Text>

      {/* Formulário POST */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Corpo"
          value={body}
          onChangeText={setBody}
        />
        <TouchableOpacity style={styles.buttonPost} onPress={createPost}>
          <Text style={styles.buttonText}>POST — Criar</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.buttonPut}
                onPress={() => updatePostPut(item)}
              >
                <Text style={styles.buttonText}>PUT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonPatch}
                onPress={() => updatePostPatch(item)}
              >
                <Text style={styles.buttonText}>PATCH</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDelete}
                onPress={() => deletePost(item.id)}
              >
                <Text style={styles.buttonText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  form: { marginBottom: 16 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  buttonPost: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardBody: { fontSize: 14, color: '#555', marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonPut: { backgroundColor: '#FF9800', padding: 8, borderRadius: 6, flex: 1, marginRight: 4, alignItems: 'center' },
  buttonPatch: { backgroundColor: '#9C27B0', padding: 8, borderRadius: 6, flex: 1, marginHorizontal: 4, alignItems: 'center' },
  buttonDelete: { backgroundColor: '#F44336', padding: 8, borderRadius: 6, flex: 1, marginLeft: 4, alignItems: 'center' },
});
