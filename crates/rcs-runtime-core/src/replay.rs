use std::collections::HashSet;

use serde::{Deserialize, Serialize};

use crate::ReplaySnapshot;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct ReplayState {
    cursor: Option<String>,
    seen_event_ids: HashSet<String>,
    deferred_leader_notification: bool,
}

impl ReplayState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn request_replay(&mut self, cursor: Option<String>) {
        self.cursor = cursor;
    }

    /// Returns true if the event is new, false if already seen.
    pub fn record_event(&mut self, event_id: impl Into<String>) -> bool {
        self.seen_event_ids.insert(event_id.into())
    }

    pub fn defer_leader_notification(&mut self) {
        self.deferred_leader_notification = true;
    }

    pub fn clear_deferred(&mut self) {
        self.deferred_leader_notification = false;
    }

    pub fn cursor(&self) -> Option<&str> {
        self.cursor.as_deref()
    }

    pub fn seen_count(&self) -> usize {
        self.seen_event_ids.len()
    }

    pub fn is_deferred(&self) -> bool {
        self.deferred_leader_notification
    }

    pub fn to_snapshot(&self) -> ReplaySnapshot {
        ReplaySnapshot {
            cursor: self.cursor.clone(),
            pending_events: 0,
            last_replayed_event_id: None,
            deferred_leader_notification: self.deferred_leader_notification,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn new_state_is_empty() {
        let state = ReplayState::new();
        assert_eq!(state.cursor(), None);
        assert_eq!(state.seen_count(), 0);
        assert!(!state.is_deferred());
    }

    #[test]
    fn request_replay_sets_cursor() {
        let mut state = ReplayState::new();
        state.request_replay(Some("cursor-1".to_string()));
        assert_eq!(state.cursor(), Some("cursor-1"));
    }

    #[test]
    fn record_event_deduplicates() {
        let mut state = ReplayState::new();
        assert!(state.record_event("evt-1"));
        assert!(!state.record_event("evt-1"));
        assert!(state.record_event("evt-2"));
        assert_eq!(state.seen_count(), 2);
    }

    #[test]
    fn deferred_notification() {
        let mut state = ReplayState::new();
        state.defer_leader_notification();
        assert!(state.is_deferred());
        state.clear_deferred();
        assert!(!state.is_deferred());
    }

    #[test]
    fn snapshot_reflects_state() {
        let mut state = ReplayState::new();
        state.request_replay(Some("cur-1".to_string()));
        state.defer_leader_notification();
        let snap = state.to_snapshot();
        assert_eq!(snap.cursor.as_deref(), Some("cur-1"));
        assert!(snap.deferred_leader_notification);
    }
}
