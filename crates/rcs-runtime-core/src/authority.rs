use std::fmt;

use serde::{Deserialize, Serialize};

use crate::AuthoritySnapshot;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AuthorityLease {
    owner: Option<String>,
    lease_id: Option<String>,
    leased_until: Option<String>,
    stale: bool,
    stale_reason: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AuthorityError {
    AlreadyHeldByOther { current_owner: String },
    OwnerMismatch { current_owner: String },
    NotHeld,
}

impl fmt::Display for AuthorityError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::AlreadyHeldByOther { current_owner } => {
                write!(f, "lease already held by {current_owner}")
            }
            Self::OwnerMismatch { current_owner } => {
                write!(f, "owner mismatch: lease held by {current_owner}")
            }
            Self::NotHeld => write!(f, "no lease currently held"),
        }
    }
}

impl std::error::Error for AuthorityError {}

impl AuthorityLease {
    pub fn new() -> Self {
        Self {
            owner: None,
            lease_id: None,
            leased_until: None,
            stale: false,
            stale_reason: None,
        }
    }

    pub fn acquire(
        &mut self,
        owner: impl Into<String>,
        lease_id: impl Into<String>,
        leased_until: impl Into<String>,
    ) -> Result<(), AuthorityError> {
        let owner = owner.into();
        if let Some(ref current) = self.owner {
            if *current != owner {
                return Err(AuthorityError::AlreadyHeldByOther {
                    current_owner: current.clone(),
                });
            }
        }
        self.owner = Some(owner);
        self.lease_id = Some(lease_id.into());
        self.leased_until = Some(leased_until.into());
        self.stale = false;
        self.stale_reason = None;
        Ok(())
    }

    pub fn renew(
        &mut self,
        owner: impl AsRef<str>,
        lease_id: impl Into<String>,
        leased_until: impl Into<String>,
    ) -> Result<(), AuthorityError> {
        match &self.owner {
            None => Err(AuthorityError::NotHeld),
            Some(current) if current != owner.as_ref() => Err(AuthorityError::OwnerMismatch {
                current_owner: current.clone(),
            }),
            _ => {
                self.lease_id = Some(lease_id.into());
                self.leased_until = Some(leased_until.into());
                self.stale = false;
                self.stale_reason = None;
                Ok(())
            }
        }
    }

    pub fn force_release(&mut self) {
        self.owner = None;
        self.lease_id = None;
        self.leased_until = None;
        self.stale = false;
        self.stale_reason = None;
    }

    pub fn mark_stale(&mut self, reason: impl Into<String>) {
        self.stale = true;
        self.stale_reason = Some(reason.into());
    }

    pub fn clear_stale(&mut self) {
        self.stale = false;
        self.stale_reason = None;
    }

    pub fn is_held(&self) -> bool {
        self.owner.is_some()
    }

    pub fn is_stale(&self) -> bool {
        self.stale
    }

    pub fn current_owner(&self) -> Option<&str> {
        self.owner.as_deref()
    }

    pub fn to_snapshot(&self) -> AuthoritySnapshot {
        AuthoritySnapshot {
            owner: self.owner.clone(),
            lease_id: self.lease_id.clone(),
            leased_until: self.leased_until.clone(),
            stale: self.stale,
            stale_reason: self.stale_reason.clone(),
        }
    }
}

impl Default for AuthorityLease {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn acquire_and_renew_happy_path() {
        let mut lease = AuthorityLease::new();
        assert!(!lease.is_held());
        lease
            .acquire("worker-1", "lease-1", "2026-03-19T02:00:00Z")
            .unwrap();
        assert!(lease.is_held());
        assert_eq!(lease.current_owner(), Some("worker-1"));
        lease
            .renew("worker-1", "lease-2", "2026-03-19T03:00:00Z")
            .unwrap();
        assert!(lease.is_held());
    }

    #[test]
    fn acquire_fails_if_held_by_other() {
        let mut lease = AuthorityLease::new();
        lease
            .acquire("worker-1", "lease-1", "2026-03-19T02:00:00Z")
            .unwrap();
        let err = lease
            .acquire("worker-2", "lease-2", "2026-03-19T03:00:00Z")
            .unwrap_err();
        assert!(matches!(err, AuthorityError::AlreadyHeldByOther { .. }));
    }

    #[test]
    fn acquire_succeeds_for_same_owner() {
        let mut lease = AuthorityLease::new();
        lease
            .acquire("worker-1", "lease-1", "2026-03-19T02:00:00Z")
            .unwrap();
        lease
            .acquire("worker-1", "lease-2", "2026-03-19T03:00:00Z")
            .unwrap();
    }

    #[test]
    fn renew_fails_if_not_held() {
        let mut lease = AuthorityLease::new();
        let err = lease
            .renew("worker-1", "lease-1", "2026-03-19T02:00:00Z")
            .unwrap_err();
        assert!(matches!(err, AuthorityError::NotHeld));
    }

    #[test]
    fn renew_fails_if_owner_mismatch() {
        let mut lease = AuthorityLease::new();
        lease
            .acquire("worker-1", "lease-1", "2026-03-19T02:00:00Z")
            .unwrap();
        let err = lease
            .renew("worker-2", "lease-2", "2026-03-19T03:00:00Z")
            .unwrap_err();
        assert!(matches!(err, AuthorityError::OwnerMismatch { .. }));
    }

    #[test]
    fn force_release_clears_everything() {
        let mut lease = AuthorityLease::new();
        lease
            .acquire("worker-1", "lease-1", "2026-03-19T02:00:00Z")
            .unwrap();
        lease.mark_stale("expired");
        lease.force_release();
        assert!(!lease.is_held());
        assert!(!lease.is_stale());
        assert_eq!(lease.current_owner(), None);
    }

    #[test]
    fn stale_marking_and_clearing() {
        let mut lease = AuthorityLease::new();
        lease
            .acquire("worker-1", "lease-1", "2026-03-19T02:00:00Z")
            .unwrap();
        lease.mark_stale("network timeout");
        assert!(lease.is_stale());
        lease.clear_stale();
        assert!(!lease.is_stale());
    }

    #[test]
    fn snapshot_reflects_current_state() {
        let mut lease = AuthorityLease::new();
        lease
            .acquire("worker-1", "lease-1", "2026-03-19T02:00:00Z")
            .unwrap();
        let snap = lease.to_snapshot();
        assert_eq!(snap.owner.as_deref(), Some("worker-1"));
        assert_eq!(snap.lease_id.as_deref(), Some("lease-1"));
        assert!(!snap.stale);
    }
}
